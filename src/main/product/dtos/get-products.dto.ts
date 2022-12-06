import { Product } from './../entities/product.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface GetProductsInput {}

export interface GetProductsOutput extends CoreOutput {
  products?: Product[];
}
