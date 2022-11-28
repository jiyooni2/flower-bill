import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AppDataSource } from './../main';
import { GetProductsInput } from './dtos/get-products.dto';

export class ProductService {
  private readonly productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async getProducts() {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .select()
        .getMany();

      console.log(products);

      return { ok: true, products };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
