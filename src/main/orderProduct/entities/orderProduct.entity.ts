import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Product } from '../../product/entities/product.entity';
import { Bill } from '../../bill/entities/bill.entity';

@Entity()
export class OrderProduct extends CoreEntity {
  @Column()
  count: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  transactionDate?: Date;

  @Column()
  orderPrice: number;

  @ManyToOne((type) => Product, (product) => product.orderProducts)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId?: number;

  @ManyToOne((type) => Bill, (bill) => bill.orderProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'billId' })
  bill?: Bill;

  @Column()
  billId?: number;
}
