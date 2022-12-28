import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AppDataSource } from './../main';
import { GetProductsInput, GetProductsOutput } from './dtos/get-products.dto';
import {
  CreateProductOutput,
  CreateProductInput,
} from './dtos/create-product.dto';

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

  async createProduct(
    createProductInput: CreateProductInput
  ): Promise<CreateProductOutput> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(createProductInput)
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
