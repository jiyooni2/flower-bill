import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity({ name: 'category' })
export class Category extends BusinessRelatedEntity {
  @Column()
  name: string;

  @Column()
  level: number;

  @ManyToOne((type) => Category)
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory?: Category;

  @Column({ nullable: true })
  parentCategoryId?: number;
}
