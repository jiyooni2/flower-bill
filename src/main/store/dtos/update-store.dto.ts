import { Store } from './../entities/store.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface UpdateStoreInput
  extends Partial<Pick<Store, 'businessNumber' | 'name' | 'address' | 'owner'>>,
    AuthInput {
  id: number;
  businessId: number;
}

export interface UpdateStoreOutput extends CoreOutput {}
