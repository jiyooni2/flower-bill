import { Store } from '../../store/entities/store.entity';

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { OrderProduct } from '../../orderProduct/entities/orderProduct.entity';

@Entity()
export class Bill extends CoreEntity {
  @Column({ nullable: true })
  memo?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  transactionDate?: Date;

  @ManyToOne((type) => Store, (store) => store.bills)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @OneToMany((type) => OrderProduct, (orderProduct) => orderProduct.bill)
  orderProducts: OrderProduct[];

  @Column()
  storeId?: number;
}
