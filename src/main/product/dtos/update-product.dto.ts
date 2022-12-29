import { CoreOutput } from './../../common/dtos/core.dto';
import { Product } from './../entities/product.entity';

export interface UpdateProductInput
  extends Partial<Pick<Product, 'name' | 'price' | 'categoryId'>> {
  id: number;
}

export interface UpdateProductOutput extends CoreOutput {}
