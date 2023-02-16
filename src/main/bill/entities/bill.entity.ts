import { Store } from '../../store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderProduct } from '../../orderProduct/entities/orderProduct.entity';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity()
export class Bill extends BusinessRelatedEntity {
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
