import { Bill } from './../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { CreateOrderProductInput } from './../../orderProduct/dtos/create-orderProduct.dto';

export interface CreateBillInput
  extends Pick<Bill, 'memo' | 'transactionDate'> {
  storeId: number;
  orderProductInputs: CreateOrderProductInput[];
}

export interface CreateBillOutput extends CoreOutput {}
