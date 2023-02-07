import { CoreOutput } from './../../common/dtos/core.dto';
import { Category } from './../entities/category.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetCategoryInput extends AuthInput {
  id: number;
  businessId: number;
}

export interface GetCategoryOutput extends CoreOutput {
  category?: Category;
}
