import { CoreOutput } from './../../common/dtos/core.dto';
import { Product } from './../entities/product.entity';

export interface SearchProductInput {
  keyword: string;
  page: number;
}

export interface SearchProductOutput extends CoreOutput {
  products?: Product[];
}
