import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AppDataSource } from './../main';
import { GetProductsInput, GetProductsOutput } from './dtos/get-products.dto';
import {
  UpdateProductInput,
  UpdateProductOutput,
} from './dtos/update-product.dto';
import {
  GetProductByCategoryOutput,
  GetProductByCategoryInput,
} from './dtos/get-product-by-category.dto';
import {
  CreateProductOutput,
  CreateProductInput,
} from './dtos/create-product.dto';
import { Category } from './../category/entities/category.entity';

export class ProductService {
  private readonly productRepository: Repository<Product>;
  private readonly categoryRepository: Repository<Category>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
    this.categoryRepository = AppDataSource.getRepository(Category);
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

  async getProductByCategory({
    categoryId,
    page,
  }: GetProductByCategoryInput): Promise<GetProductByCategoryOutput> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: { childCategories: true },
      });

      if (!category) {
        return { ok: false, error: '존재하지 않는 카테고리입니다.' };
      }

      const { level: categoryLevel } = category;

      //level에 대해서 ENUM으로 관리하기
      if (categoryLevel === 3) {
        const products = await this.productRepository
          .createQueryBuilder(Product.name)
          .select()
          .where('categoryId=:categoryId', { categoryId })
          .offset(page)
          .limit(10)
          .execute();

        console.log(products);

        return { ok: true, products };
      } else if (categoryLevel === 2) {
        let products: Product[] = [];

        for (const { id: categoryId } of category.childCategories) {
          const tempProducts = await this.productRepository
            .createQueryBuilder(Product.name)
            .select()
            .where('categoryId=:categoryId', { categoryId })
            .offset(page)
            .limit(10)
            .execute();

          products.push(tempProducts);
        }

        return { ok: true, products };
      } else {
        let products: Product[] = [];

        //need to refactor, getProductByCategory의 재귀호출 고려

        console.log(category.childCategories);
        return { ok: true };
      }
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
