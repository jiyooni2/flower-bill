import { Store } from '../../store/entities/store.entity';

import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

@Entity()
export class Bill extends CoreEntity {
  @Column()
  memo: string;

  @ManyToOne((type) => Store, (store) => store.bills)
  store: Store;
}
