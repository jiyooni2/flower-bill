import { CoreOutput } from './../../common/dtos/core.dto';
import { Category } from './../entities/category.entity';

export interface GetCategoryInput {
  id: number;
}

export interface GetCategoryOutput extends CoreOutput {
  category?: Category;
}
