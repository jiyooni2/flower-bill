import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AppDataSource } from './../main';
import { GetProductsInput, GetProductsOutput } from './dtos/get-products.dto';
import {
  UpdateProductInput,
  UpdateProductOutput,
} from './dtos/update-product.dto';
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
      const products = await this.productRepository.find({
        relations: {
          category: true,
        },
      });

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

  async updateProduct({
    id,
    ...updateProductInput
  }: UpdateProductInput): Promise<UpdateProductOutput> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        return { ok: false, error: '존재하지 않는 상품입니다.' };
      }

      await this.productRepository.update({ id }, { ...updateProductInput });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteProduct({
    id,
  }: UpdateProductInput): Promise<UpdateProductOutput> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        return { ok: false, error: '존재하지 않는 상품입니다.' };
      }

      await this.productRepository.delete({ id });
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
