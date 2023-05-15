import { AuthInput } from 'main/common/dtos/auth.dto';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface DeleteCategoryInput extends AuthInput {
  businessId: number;
  id: number;
}

export interface DeleteCategoryOutput extends CoreOutput {}
