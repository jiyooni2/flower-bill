import { OrderProduct } from './../../../renderer/types/index';
import { Bill } from 'main/bill/entities/bill.entity';

export interface BillResult extends Bill {
  orderProducts?: OrderProduct[];
}
