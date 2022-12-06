import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AppDataSource } from './../main';
import { GetProductsInput, GetProductsOutput } from './dtos/get-products.dto';

export class ProductService {
  private readonly productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async getProducts(): Promise<GetProductsOutput> {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .select()
        .getMany();

      return { ok: true, products };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
