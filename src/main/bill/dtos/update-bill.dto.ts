import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { CreateOrderProductInput } from './../../orderProduct/dtos/create-orderProduct.dto';

export interface UpdateBillInput
  extends Partial<Pick<Bill, 'transactionDate' | 'memo'>> {
  storeId?: number;
  orderProductInputs?: CreateOrderProductInput[];
  id: number;
}

export interface UpdateBillOutput extends CoreOutput {}
