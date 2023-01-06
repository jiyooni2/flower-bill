import { CoreOutput } from './../../common/dtos/core.dto';
import { Product } from './../entities/product.entity';

export interface GetProductByCategoryInput {
  categoryId: number;
  page: number;
}

export interface GetProductByCategoryOutput extends CoreOutput {
  products?: Product[];
}
