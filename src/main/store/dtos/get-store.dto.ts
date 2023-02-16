import { CoreOutput } from './../../common/dtos/core.dto';
import { Store } from './../entities/store.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetStoreInput extends AuthInput {
  id: number;
  businessId: number;
}

export interface GetStoreOutput extends CoreOutput {
  store?: Store;
}
