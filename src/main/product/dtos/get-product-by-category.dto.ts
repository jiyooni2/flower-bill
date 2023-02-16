import { CoreOutput } from './../../common/dtos/core.dto';
import { Product } from './../entities/product.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetProductByCategoryInput extends AuthInput {
  categoryId: number;
  page: number;
  businessId: number;
}

export interface GetProductByCategoryOutput extends CoreOutput {
  products?: Product[];
}
