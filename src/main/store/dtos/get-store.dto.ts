import { CoreOutput } from './../../common/dtos/core.dto';
import { Store } from './../entities/store.entity';
export interface GetStoreInput {
  id: number;
}

export interface GetStoreOutput extends CoreOutput {
  store?: Store;
}
