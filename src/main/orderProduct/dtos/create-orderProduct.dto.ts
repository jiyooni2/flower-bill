import { OrderProduct } from '../entities/orderProduct.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface CreateOrderProductInput
  extends Pick<OrderProduct, 'count' | 'transactionDate'> {
  productId: number;
  orderPrice: number;
}

export interface CreateOrderProductOutput extends CoreOutput {}
