import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, PipelineStage, Types, UpdateQuery } from 'mongoose';

import { ISearchQuery, PaginatedResult } from '@app/shared/interface/common.interface';
import { LookupOptions } from './interface/generic-mongo.interface';

// AbstractRepository class is used to define a base class for all Mongoose repositories ex: UserRepository.
export abstract class AbstractRepository<T> {
  // protected property is a class member that can be accessed by the class itself and its subclasses.
  protected abstract readonly logger: Logger;
  // model is used to define a Mongoose model.
  constructor(public readonly model: Model<T>) {}

  async create(document: Partial<T>): Promise<T> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    // .save() method is used to save a document to the database.
    // .toJSON() method is used to convert a Mongoose document to a JSON object.
    // as unknown as T is used to cast the JSON object to the T type.
    return (await createdDocument.save()).toJSON() as unknown as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    // { lean: true } option is used to return a plain JavaScript object rather than a Mongoose document.
    // {} is used to define the projection. In this case, we are not using any projection. A projection is used to select only the necessary fields from the document.
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document not found with filterQuery: %o', filterQuery);
      throw new NotFoundException('Document not found');
    }

    return document as unknown as T;
  }

  async findOneAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      // lean option is used to return a plain JavaScript object rather than a Mongoose document
      lean: true,
      // new option is used to return the modified document rather than the original
      new: true,
    });

    if (!document) {
      this.logger.warn('Document not found with filterQuery: %o', filterQuery);
      throw new NotFoundException('Document not found');
    }

    return document as unknown as T;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(
      filterQuery,
      // {} is used to define the projection. In this case, we are not using any projection. A projection is used to select only the necessary fields from the document.
      {},
      // { lean: true } option is used to return a plain JavaScript object rather than a Mongoose document.
      { lean: true },
    ) as unknown as T[];
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return this.model.findOneAndDelete(filterQuery, {
      lean: true,
    }) as unknown as T;
  }

  // Soft delete
  async softDelete(id: string | Types.ObjectId): Promise<boolean> {
    const data = await this.model.findByIdAndUpdate(id, { is_deleted: true }).exec();
    return !!data;
  }

  // Pagination with aggregation
  async fetchByPagination(
    query: ISearchQuery | any,
    sort: any,
    skip: number,
    limit: number,
    offset: number,
    select?: any,
    lookup?: LookupOptions | LookupOptions[],
  ): Promise<PaginatedResult<T>> {
    try {
      const [countResult, dataResult] = await Promise.all([
        this.model.countDocuments(query).exec(),
        this.model
          .aggregate([
            { $match: query },
            ...(lookup ? this.buildLookupStages(lookup) : []),
            { $sort: sort },
            ...(select ? [{ $project: select }] : []),
            { $skip: skip },
            { $limit: limit },
            {
              $addFields: {
                id: { $toString: '$_id' },
              },
            },
          ])
          .exec(),
      ]);

      const total = countResult;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = offset < totalPages;

      return {
        data: dataResult,
        total,
        totalPages,
        hasNextPage,
      };
    } catch (error) {
      console.error('Fetch pagination error:', error);
      throw error;
    }
  }

  // Bulk update
  async bulkUpdate(bulkOps: any): Promise<{ matchedCount: number; modifiedCount: number } | null> {
    try {
      const result = await this.model.bulkWrite(bulkOps);

      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (error) {
      this.logger.error('Error in bulk update', error);
      return null;
    }
  }

  // Update many documents
  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const result = await this.model.updateMany(filter, update).exec();
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  // Get distinct values
  async distinct<K extends keyof T>(
    field: K,
    filter?: FilterQuery<T>,
  ): Promise<T[K] extends string | number | boolean ? T[K][] : any[]> {
    const result = await this.model.distinct(field as string, filter).exec();
    return result as any;
  }

  // Count documents
  async countDocuments(options?: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(options);
  }

  // Aggregate method
  async aggregate(pipeline: any): Promise<any[] | null> {
    try {
      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      this.logger.error('Error in aggregation', error);
      return null;
    }
  }

  private buildLookupStages(lookupOptions: LookupOptions | LookupOptions[]): PipelineStage[] {
    const lookups = Array.isArray(lookupOptions) ? lookupOptions : [lookupOptions];

    return lookups.flatMap(lookup => {
      const stages = [];

      // Build the lookup pipeline
      const lookupPipeline = [];

      // Add selection to lookup pipeline if specified
      if (lookup.select) {
        lookupPipeline.push({ $project: lookup.select });
      }

      // Add any additional custom pipeline stages
      if (lookup.pipeline) {
        lookupPipeline.push(...lookup.pipeline);
      }

      // Basic lookup stage
      const lookupStage: PipelineStage.Lookup = {
        $lookup: {
          from: lookup.from,
          localField: lookup.localField,
          foreignField: lookup.foreignField,
          as: lookup.as,
          ...(lookupPipeline.length > 0 && { pipeline: lookupPipeline }),
        },
      };

      stages.push(lookupStage);

      // Add unwind stage if specified (default to true if not specified)
      if (lookup.unwind !== false) {
        stages.push({
          $unwind: {
            path: `$${lookup.as}`,
            preserveNullAndEmptyArrays: true,
          },
        });
      }

      return stages;
    });
  }
}
