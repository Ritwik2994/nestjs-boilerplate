import { Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { ISearchQuery, ISort, PaginatedResult } from '../interface/common.interface';
import { FindOptions } from './interface/generic-mongo.interface';

@Injectable()
export class GenericMongoRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async find(options?: FindOptions): Promise<T[]> {
    let query = this.model.find();

    if (options?.filter) {
      query = query.find(options.filter);
    }

    if (options?.sort) {
      query = query.sort(options.sort);
    }

    if (options?.skip) {
      query = query.skip(options.skip);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    return await query.exec();
  }

  async findOne(filter?: any): Promise<T | any> {
    return await this.model.findOne(filter).lean();
  }

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    return await this.model.findOne({ _id: id }).exec();
  }

  async create(doc: Partial<T>): Promise<T> {
    try {
      const model = new this.model(doc) as T;
      return await model.save();
    } catch (error) {
      console.log('🚀 ~ GenericMongoRepository<T ~ create ~ error:', error);
    }
  }

  async findOneAndUpdate(filter: any, update: any): Promise<T | any> {
    return await this.model.findOneAndUpdate(filter, update, { new: true, lean: true });
  }

  async update(id: string, updateDto: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async countDocuments(options?: FilterQuery<T>) {
    return await this.model.countDocuments(options);
  }

  async aggregate(pipeline: any) {
    try {
      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      console.log('🚀 ~ GenericMongoRepository<T ~ aggregate ~ error:', error);
    }
  }

  async softDelete(id: string | Types.ObjectId): Promise<boolean> {
    const data = await this.model.findByIdAndUpdate(id, { is_deleted: true }).exec();

    if (!data) return false;
    else return true;
  }

  async fetchByPaginationAndNextPageToken(query: ISearchQuery | any, sort: ISort, limit: number): Promise<any> {
    try {
      const pipeline = [
        { $match: query },
        { $sort: sort },
        { $limit: limit },
        {
          $addFields: {
            id: { $toString: '$_id' },
          },
        },
      ];

      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      console.log('🚀 ~ GenericMongoRepository<T ~ fetchByPaginationAndNextPageToken ~ error:', error);
      throw error;
    }
  }

  async fetchByPagination(
    query: ISearchQuery | any,
    sort: ISort,
    skip: number,
    limit: number,
    select?: any,
  ): Promise<PaginatedResult<T>> {
    const pipeline = [
      { $match: query },
      { $sort: sort },
      ...(select ? [{ $project: select }] : []),
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          id: { $toString: '$_id' },
        },
      },
    ];

    const data = await this.model.aggregate(pipeline).exec();

    const total = await this.model.countDocuments(query).exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  }

  async bulkUpdate(bulkOps: any): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const result = await this.model.bulkWrite(bulkOps);

      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (err) {
      console.log(err);
    }
  }

  // Update many method
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

  async distinct<K extends keyof T>(
    field: K,
    filter?: FilterQuery<T>,
  ): Promise<T[K] extends string | number | boolean ? T[K][] : any[]> {
    const result = await this.model.distinct(field as string, filter).exec();
    return result as any;
  }
}
