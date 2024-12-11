import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from '@app/db/abstract.repository';
import { ILedger } from '../interface/ledger.interface';
import { LEDGER_MONGOOSE_PROVIDER } from '../schema/ledger.schema';

export class LedgersRepository extends AbstractRepository<ILedger> {
  protected readonly logger = new Logger(LedgersRepository.name);

  constructor(
    @InjectModel(LEDGER_MONGOOSE_PROVIDER)
    private readonly ledgersModel: Model<ILedger>,
  ) {
    super(ledgersModel);
  }
}
