import { CoreOutput } from './../../common/dtos/core.dto';
import { Product } from './../entities/product.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface SearchProductInput extends AuthInput {
  keyword: string;
  page: number;
  businessId: number;
}

export interface SearchProductOutput extends CoreOutput {
  products?: Product[];
}
