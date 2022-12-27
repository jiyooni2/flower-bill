import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface UpdateBillInput
  extends Partial<
    Pick<Bill, 'transactionDate' | 'memo' | 'orderProducts' | 'store'>
  > {
  id: number;
}

export interface UpdateBillOutput extends CoreOutput {}
