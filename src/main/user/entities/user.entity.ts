import { Column, Entity } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';

@Entity()
export class User extends CoreEntity {
  @Column()
  businessNumber: number;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  password: string;

  @Column()
  address?: string;
}
