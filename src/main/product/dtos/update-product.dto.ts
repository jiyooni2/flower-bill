import { CoreOutput } from './../../common/dtos/core.dto';
import { Product } from './../entities/product.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface UpdateProductInput
  extends Partial<Pick<Product, 'name' | 'price' | 'categoryId'>>,
    AuthInput {
  id: number;
  businessId: number;
}

export interface UpdateProductOutput extends CoreOutput {}
