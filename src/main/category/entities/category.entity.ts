import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';
import { Product } from './../../product/entities/product.entity';

@Entity()
export class Category extends CoreEntity {
  @Column()
  name: string;

  @Column()
  level: number;

  @ManyToOne((type) => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @OneToMany((type) => Product, (product) => product.category)
  products: Product[];
}
