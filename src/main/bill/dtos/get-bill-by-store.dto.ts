import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetBillByStoreInput extends AuthInput {
  storeId: number;
  page: number;
  businessId: number;
}

export interface GetBillByStoreOutput extends CoreOutput {
  bills?: Bill[];
}
