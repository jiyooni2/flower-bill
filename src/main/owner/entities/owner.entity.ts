import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

@Entity()
export class Owner extends CoreEntity {
  @Column()
  nickname: string;

  @Column({ unique: true })
  ownerId: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  findPasswordCode: string;
}
