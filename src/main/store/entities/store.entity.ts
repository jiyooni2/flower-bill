import { Column, Entity } from 'typeorm';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity()
export class Store extends BusinessRelatedEntity {
  @Column()
  businessNumber: number;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  address?: string;
}
