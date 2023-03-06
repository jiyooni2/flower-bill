import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AppDataSource, authService } from './../main';
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
  DeleteProductInput,
  DeleteProductOutput,
} from './dtos/delete-product.dto';
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

  async getProducts({
    page,
    token,
    businessId,
  }: GetProductsInput): Promise<GetProductsOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const products = await this.productRepository
        .createQueryBuilder()
        .select()
        .orderBy('product.id')
        .offset(page)
        .limit(10)
        .getMany();

      console.log(products);

      return { ok: true, products };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async createProduct({
    name,
    price,
    categoryId,
    token,
    businessId,
  }: CreateProductInput): Promise<CreateProductOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        return { ok: false, error: '없는 카테고리입니다.' };
      }

      if (category.level !== 3) {
        return { ok: false, error: '최하위 카테고리를 입력해야 합니다.' };
      }

      await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values({ name, price, categoryId, businessId })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateProduct({
    id,
    name,
    price,
    categoryId,
    token,
    businessId,
  }: UpdateProductInput): Promise<UpdateProductOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        return { ok: false, error: '존재하지 않는 상품입니다.' };
      }
      if (product.businessId !== businessId) {
        return { ok: false, error: '해당 상품에 권한이 없습니다.' };
      }

      await this.productRepository.update(
        { id },
        { name, price, categoryId, businessId }
      );

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteProduct({
    id,
    token,
    businessId,
  }: DeleteProductInput): Promise<DeleteProductOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        return { ok: false, error: '존재하지 않는 상품입니다.' };
      }
      if (product.businessId !== businessId) {
        return { ok: false, error: '해당 상품에 권한이 없습니다.' };
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
    token,
    businessId,
  }: SearchProductInput): Promise<SearchProductOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const products = await this.productRepository
        .createQueryBuilder()
        .select()
        .where(`name LIKE "%${keyword}%"`)
        .andWhere(`businessId=:businessId`, { businessId })
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
    businessId,
    token,
  }: GetProductByCategoryInput): Promise<GetProductByCategoryOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: { childCategories: true },
      });

      if (!category) {
        return { ok: false, error: '존재하지 않는 카테고리입니다.' };
      }

      if (category.businessId !== businessId) {
        return { ok: false, error: '해당 카테고리에 대한 권한이 없습니다.' };
      }

      const { level: categoryLevel } = category;

      console.log(categoryLevel);

      if (categoryLevel === 3) {
        const products: Product[] = await this.productRepository
          .createQueryBuilder(Product.name)
          .select()
          .where('categoryId=:categoryId', { categoryId })
          .andWhere('businessId=:businessId', { businessId })
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
          .andWhere('businessId=:businessId', { businessId })
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
          .andWhere('businessId=:businessId', { businessId })
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
          .andWhere('businessId=:businessId', { businessId })
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
