import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './../../category/entities/category.entity';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity()
export class Product extends BusinessRelatedEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne((type) => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  // @Column('string', { array: true })
  // color: string[];
}
