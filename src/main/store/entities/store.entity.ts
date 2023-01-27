import { Column, Entity, OneToMany } from 'typeorm';
import { Bill } from '../../bill/entities/bill.entity';
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

  @OneToMany((type) => Bill, (bill) => bill.store)
  bills: Bill[];
}
