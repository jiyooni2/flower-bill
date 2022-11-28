import { Store } from '../../store/entities/store.entity';

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { OrderProduct } from './../../orderProduct/orderProduct.entity';

@Entity()
export class Bill extends CoreEntity {
  @Column()
  memo: string;

  @ManyToOne((type) => Store, (store) => store.bills)
  store: Store;

  @OneToMany((type) => OrderProduct, (orderProduct) => orderProduct.bill)
  orderProducts: OrderProduct[];
}
