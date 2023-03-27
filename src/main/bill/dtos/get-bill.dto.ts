import { BillResult } from './../../common/dtos/bill-result.dto';
import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetBillInput extends Pick<Bill, 'id'>, AuthInput {
  businessId: number;
}

export interface GetBillOutput extends CoreOutput {
  bill?: BillResult;
}
