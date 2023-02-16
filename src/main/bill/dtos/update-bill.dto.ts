import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { CreateOrderProductInput } from './../../orderProduct/dtos/create-orderProduct.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface UpdateBillInput
  extends Partial<Pick<Bill, 'transactionDate' | 'memo'>>,
    AuthInput {
  storeId?: number;
  orderProductInputs?: CreateOrderProductInput[];
  id: number;
  businessId: number;
}

export interface UpdateBillOutput extends CoreOutput {}
