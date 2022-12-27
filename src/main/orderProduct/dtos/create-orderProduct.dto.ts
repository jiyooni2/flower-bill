import { OrderProduct } from '../entities/orderProduct.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface CreateOrderProductInput
  extends Pick<OrderProduct, 'count' | 'transactionDate'> {
  productId: number;
}

export interface CreateOrderProductOutput extends CoreOutput {}
