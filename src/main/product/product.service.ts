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
import {
  SearchProductInput,
  SearchProductOutput,
} from './dtos/search-product.dto';

export class ProductService {
  private readonly productRepository: Repository<Product>;
  private readonly categoryRepository: Repository<Category>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async getProducts({ page }: GetProductsInput): Promise<GetProductsOutput> {
    try {
      const products = await this.productRepository
        .createQueryBuilder()
        .select()
        .orderBy('product.id')
        .offset(page)
        .limit(10)
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

  async searchProduct({
    keyword,
    page,
  }: SearchProductInput): Promise<SearchProductOutput> {
    try {
      const products = await this.productRepository
        .createQueryBuilder()
        .select()
        .where(`name LIKE "%${keyword}%"`)
        .orderBy('product.id')
        .offset(page)
        .limit(10)
        .getMany();

      return { ok: true, products };
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

      console.log(categoryLevel);

      if (categoryLevel === 3) {
        const products: Product[] = await this.productRepository
          .createQueryBuilder(Product.name)
          .select()
          .where('categoryId=:categoryId', { categoryId })
          .orderBy('product.id')
          .offset(page)
          .limit(10)
          .getMany();

        console.log(products);

        return { ok: true, products };
      } else if (categoryLevel === 2) {
        const products: Product[] = await this.productRepository
          .createQueryBuilder(Product.name)
          .select()
          .where('categoryId IN(:...ids)', {
            ids: category.childCategories.map(
              (childCategory) => childCategory.id
            ),
          })
          .orderBy('product.id')
          .offset(page)
          .limit(10)
          .getMany();

        return { ok: true, products };
      } else {
        let subCategoryIds = category.childCategories.map(
          (childCategory) => childCategory.id
        );

        const subCategories = await this.categoryRepository
          .createQueryBuilder(Category.name)
          .select()
          .where('parentCategoryId IN(:...ids)', {
            ids: subCategoryIds,
          })
          .getMany();

        subCategoryIds = subCategories.map((subCategory) => subCategory.id);

        console.log(subCategories);

        //최종적으로는 level=3 인 카테고리로만 관계 맺혀져 있으므로 level 3인 카테고리에서만 찾으면 됨
        const products: Product[] = await this.productRepository
          .createQueryBuilder(Product.name)
          .select()
          .where('categoryId IN(:...ids)', {
            ids: subCategoryIds,
          })
          .orderBy('product.id')
          .offset(page)
          .limit(10)
          .getMany();

        console.log(products);

        return { ok: true, products };
      }
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
