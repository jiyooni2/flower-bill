import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Owner } from '../../owner/entities/owner.entity';

@Entity({ name: 'business' })
export class Business extends CoreEntity {
  @Column()
  name: string;

  @Column({ type: 'bigint' })
  businessNumber: number;

  @Column()
  businessOwnerName: string;

  @Column({ nullable: true })
  address?: string;

  @ManyToOne((type) => Owner)
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @Column()
  ownerId: number;

  //업태
  @Column({ nullable: true })
  typeofBusiness?: string;

  //업종
  @Column({ nullable: true })
  sector?: string;

  @Column({ nullable: true })
  accountNumber?: string;

  @Column({ nullable: true })
  accountBank?: string;

  @Column({ nullable: true })
  accountOwner?: string;
}
