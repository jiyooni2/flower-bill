import { Store } from './../entities/store.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface UpdateStoreInput
  extends Partial<
    Pick<Store, 'businessNumber' | 'name' | 'address' | 'owner'>
  > {
  id: number;
}

export interface UpdateStoreOutput extends CoreOutput {}
