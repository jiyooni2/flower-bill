import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface DeleteStoreInput extends AuthInput {
  id: number;
  businessId: number;
}

export interface DeleteStoreOutput extends CoreOutput {}
