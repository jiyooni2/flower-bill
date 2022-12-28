import { Product } from '../entities/product.entity';
import { CoreOutput } from '../../common/dtos/core.dto';

export interface CreateProductInput extends Pick<Product, 'name' | 'price'> {
  categoryId: number;
}

export interface CreateProductOutput extends CoreOutput {}
