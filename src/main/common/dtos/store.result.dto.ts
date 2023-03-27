import { Bill } from 'main/bill/entities/bill.entity';
import { Store } from 'main/store/entities/store.entity';

export interface StoreResult extends Store {
  bills?: Bill[];
}
