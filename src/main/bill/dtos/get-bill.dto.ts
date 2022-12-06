import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface GetBillInput extends Pick<Bill, 'id'> {}

export interface GetBillOutput extends CoreOutput {
  bill?: Bill;
}
