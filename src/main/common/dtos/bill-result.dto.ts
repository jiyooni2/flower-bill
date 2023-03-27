import { Bill } from 'main/bill/entities/bill.entity';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';

export interface BillResult extends Bill {
  orderProducts?: OrderProduct[];
}
