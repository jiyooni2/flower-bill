import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Bill } from '../../bill/entities/bill.entity';

@Entity()
export class Store extends CoreEntity {
  @Column()
  businessNumber: number;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  address: string;

  @OneToMany((type) => Bill, (bill) => bill.store)
  bills: Bill[];
}
