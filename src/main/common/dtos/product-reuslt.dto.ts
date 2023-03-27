import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import { Product } from 'main/product/entities/product.entity';

export interface ProductResult extends Product {
  orderProducts?: OrderProduct[];
}
