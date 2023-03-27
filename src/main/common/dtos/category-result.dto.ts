import { Product } from 'main/product/entities/product.entity';
import { Category } from 'main/category/entities/category.entity';

export interface CategoryResult extends Category {
  childCategories?: Category[];
  products?: Product[];
}
