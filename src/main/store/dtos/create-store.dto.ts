import { Store } from '../entities/store.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface CreateStoreInput
  extends Pick<Store, 'name' | 'businessNumber' | 'owner' | 'address'>,
    AuthInput {
  businessId: number;
}

export interface CreateStoreOutput extends CoreOutput {}
