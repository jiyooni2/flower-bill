import { Store } from '../../store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BusinessRelatedEntity } from './../../common/entities/business-related.entity';

@Entity()
export class Bill extends BusinessRelatedEntity {
  @Column({ nullable: true })
  memo?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  transactionDate?: Date;

  @ManyToOne((type) => Store)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  storeId?: number;
}
