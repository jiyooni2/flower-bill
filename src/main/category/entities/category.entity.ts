import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './../../product/entities/product.entity';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity()
export class Category extends BusinessRelatedEntity {
  @Column()
  name: string;

  @Column()
  level: number;

  @ManyToOne((type) => Category, (category) => category.childCategories)
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory?: Category;

  @Column({ nullable: true })
  parentCategoryId?: number;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @OneToMany((type) => Product, (product) => product.category)
  products: Product[];
}
