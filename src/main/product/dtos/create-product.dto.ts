import { Product } from '../entities/product.entity';
import { CoreOutput } from '../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface CreateProductInput
  extends Pick<Product, 'name' | 'price'>,
    AuthInput {
  categoryId: number;
  businessId: number;
}

export interface CreateProductOutput extends CoreOutput {}
