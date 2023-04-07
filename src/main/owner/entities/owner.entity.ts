import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

@Entity()
export class Owner extends CoreEntity {
  @Column()
  nickname: string;

  @Column()
  ownerId: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  findPasswordQuestion: string;

  @Column({ nullable: true })
  findPasswordAnswer: string;
}
