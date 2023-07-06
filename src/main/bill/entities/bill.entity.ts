import { Store } from '../../store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity()
export class Bill extends BusinessRelatedEntity {
  @Column({ nullable: true })
  memo?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  transactionDate?: Date;

  @ManyToOne((type) => Store, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store?: Store;

  @Column({ nullable: true })
  storeId?: number;
}
