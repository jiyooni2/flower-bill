import { CoreOutput } from './../../common/dtos/core.dto';
import { Store } from './../entities/store.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetStoresInput extends AuthInput {
  page: number;
  businessId: number;
}

export interface GetStoresOutput extends CoreOutput {
  stores?: Store[];
}
