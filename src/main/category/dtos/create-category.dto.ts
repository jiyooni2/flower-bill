import { Category } from '../entities/category.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface CreateCategoryInput extends Pick<Category, 'name'>, AuthInput {
  parentCategoryId?: number;
  businessId: number;
}

export interface CreateCategoryOutput extends CoreOutput {}
