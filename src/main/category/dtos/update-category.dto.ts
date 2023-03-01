import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';
import { Category } from '../entities/category.entity';

export interface UpdateCategoryInput
  extends Partial<Pick<Category, 'name'>>,
    AuthInput {
  businessId: number;
}

export interface UpdateCategoryOutput extends CoreOutput {}
