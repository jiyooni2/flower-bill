import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetBillInput extends Pick<Bill, 'id'>, AuthInput {
  businessId: number;
}

export interface GetBillOutput extends CoreOutput {
  bill?: Bill;
}
