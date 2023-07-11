import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Bill } from '../../bill/entities/bill.entity';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity({ name: 'orderProduct' })
export class OrderProduct extends BusinessRelatedEntity {
  @Column()
  count: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  transactionDate?: Date;

  @Column()
  orderPrice: number;

  @ManyToOne((type) => Product, (product) => product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId?: number;

  @ManyToOne((type) => Bill, (bill) => bill, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'billId' })
  bill?: Bill;

  @Column()
  billId?: number;
}
