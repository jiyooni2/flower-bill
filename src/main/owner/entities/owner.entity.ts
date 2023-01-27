import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

@Entity()
export class Owner extends CoreEntity {
  @Column()
  name: string;

  @Column()
  password: string;
}
