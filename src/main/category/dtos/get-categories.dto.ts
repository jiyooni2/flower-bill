import { CategoryResult } from './../../common/dtos/category-result.dto';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';
import { Category } from '../entities/category.entity';

export interface GetCategoriesInput extends AuthInput {
  businessId: number;
}

export interface GetCategoriesOutput extends CoreOutput {
  categories?: CategoryResult[];
}
