import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface GetBillByStoreInput {
  storeId: number;
  page: number;
}

export interface GetBillByStoreOutput extends CoreOutput {
  bills?: Bill[];
}
