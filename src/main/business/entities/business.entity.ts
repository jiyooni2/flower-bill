import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Owner } from '../../owner/entities/owner.entity';

@Entity()
export class Business extends CoreEntity {
  @Column()
  name: string;

  @Column({ type: 'bigint' })
  businessNumber: number;

  @Column()
  businessOwnerName: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne((type) => Owner)
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @Column()
  ownerId: number;

  //업태
  @Column()
  typeofBusiness?: string;

  //업종
  @Column()
  sector?: string;
}
