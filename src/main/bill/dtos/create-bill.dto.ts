import { Bill } from './../entities/bill.entity';

type CreateBillInputType = Pick<Bill, 'memo'>;

export class CreateBillInput implements CreateBillInputType {
  memo: string;
  storeId: number;
}
