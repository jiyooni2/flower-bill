import { Product } from './../entities/product.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetProductsInput extends AuthInput {
  page: number;
  businessId: number;
}

export interface GetProductsOutput extends CoreOutput {
  products?: Product[];
}
