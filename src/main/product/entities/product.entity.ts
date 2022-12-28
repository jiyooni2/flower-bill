import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';
import { Category } from './../../category/entities/category.entity';
import { OrderProduct } from '../../orderProduct/entities/orderProduct.entity';

@Entity()
export class Product extends CoreEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne((type) => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany((type) => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];

  @Column()
  categoryId: number;

  // @Column('string', { array: true })
  // color: string[];
}
