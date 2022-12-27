import { CoreOutput } from './../../common/dtos/core.dto';
import { Store } from './../entities/store.entity';

export interface GetStoresInput {
  page: number;
}

export interface GetStoresOutput extends CoreOutput {
  stores?: Store[];
}
