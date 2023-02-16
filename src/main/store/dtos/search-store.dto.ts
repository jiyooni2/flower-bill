import { Store } from '../entities/store.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface SearchStoreInput extends AuthInput {
  keyword: string;
  page: number;
  businessId: number;
}

export interface SearchStoreOutput extends CoreOutput {
  stores?: Store[];
}
