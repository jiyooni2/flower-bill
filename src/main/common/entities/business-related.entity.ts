import { ManyToOne, JoinColumn, Column } from 'typeorm';
import { Owner } from './../../owner/entities/owner.entity';
import { Business } from './../../business/entities/business.entity';
import { CoreEntity } from './core.entity';

export abstract class BusinessRelatedEntity extends CoreEntity {
  @ManyToOne((type) => Business)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  businessId: number;
}
