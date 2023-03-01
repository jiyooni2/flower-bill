import { AuthInput } from './../../common/dtos/auth.dto';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface DeleteBusinessInput extends AuthInput {
  businessId: number;
}

export interface DeleteBusinessOutput extends CoreOutput {}
