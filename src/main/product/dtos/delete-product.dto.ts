import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface DeleteProductInput extends AuthInput {
  id: number;
  businessId: number;
}

export interface DeleteProductOutput extends CoreOutput {}
