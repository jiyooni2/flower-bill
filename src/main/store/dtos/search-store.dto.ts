import { Store } from '../entities/store.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface SearchStoreInput {
  keyword: string;
}

export interface SearchStoreOutput extends CoreOutput {
  stores?: Store[];
}
