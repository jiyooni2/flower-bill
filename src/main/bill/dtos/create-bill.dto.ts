import { Bill } from './../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { CreateOrderProductInput } from './../../orderProduct/dtos/create-orderProduct.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface CreateBillInput
  extends Pick<Bill, 'memo' | 'transactionDate'>,
    AuthInput {
  storeId: number;
  businessId: number;
  orderProductInputs: CreateOrderProductInput[];
}

export interface CreateBillOutput extends CoreOutput {}
