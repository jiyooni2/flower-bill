import { Category } from '../entities/category.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface CreateCategoryInput extends Pick<Category, 'name'> {
  parentCategoryId?: number;
}

export interface CreateCategoryOutput extends CoreOutput {}
