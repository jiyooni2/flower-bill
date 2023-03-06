import { Bill } from 'main/bill/entities/bill.entity';
import { CoreOutput } from 'main/common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetBillsInput extends AuthInput {
  businessId: number;
  page: number;
}

export interface GetBillsOutput extends CoreOutput {
  bills?: Bill[];
}
