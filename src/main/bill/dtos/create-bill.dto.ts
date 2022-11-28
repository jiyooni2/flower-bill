import { Bill } from './../entities/bill.entity';

export interface CreateBillInput extends Pick<Bill, 'memo'> {
  storeId?: number;
}
