import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from './../common/entities/core.entity';
import { Product } from './../product/entities/product.entity';
import { Bill } from '../bill/entities/bill.entity';

@Entity()
export class OrderProduct extends CoreEntity {
  @Column()
  count: number;

  @Column()
  transactionDate: Date;

  @ManyToOne((type) => Product, (product) => product.orderProducts)
  product: Product;

  @ManyToOne((type) => Bill, (bill) => bill.orderProducts)
  bill?: Bill;
}
