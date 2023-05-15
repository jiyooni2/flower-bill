import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from './dtos/update-category.dto';
import {
  GetCategoriesInput,
  GetCategoriesOutput,
} from './dtos/get-categories.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import {
  AppDataSource,
  productService,
  authService,
  categoryService,
} from './../main';
import {
  DeleteCategoryInput,
  DeleteCategoryOutput,
} from './dtos/delete-category.dto';
import { GetCategoryInput, GetCategoryOutput } from './dtos/get-category.dto';
import {
  CreateCategoryOutput,
  CreateCategoryInput,
} from './dtos/create-category.dto';
import { CategoryResult } from 'main/common/dtos/category-result.dto';

export class CategoryService {
  private readonly categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async createCategory({
    name,
    parentCategoryId,
    token,
    businessId,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      let parentCategory;

      if (parentCategoryId) {
        parentCategory = await this.categoryRepository.findOne({
          where: { id: parentCategoryId },
        });

        if (!parentCategory) {
          return { ok: false, error: '존재하지 않는 상위 카테고리입니다.' };
        }

        if (parentCategory.level === 3) {
          return {
            ok: false,
            error: '최하위 카테고리가 부모가 될 수 없습니다.',
          };
        }
      }

      await this.categoryRepository
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values({
          name,
          parentCategoryId: parentCategory ? parentCategory.id : undefined,
          level: parentCategory ? parentCategory.level + 1 : 1,
          businessId,
        })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteCategory({
    id,
    token,
    businessId,
  }: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        return { ok: false, error: '존재하지 않는 카테고리입니다.' };
      }

      const { ok, products } = await productService.getProductByCategory({
        categoryId: id,
        page: 0,
        token,
        businessId,
      });

      if (!ok) {
        return { ok: false, error: '카테고리 정보를 가져오는데 실패했습니다.' };
      }

      if (products.length !== 0) {
        return {
          ok: false,
          error:
            '카테고리에 속해있는 상품이 존재합니다. 카테고리에 속하는 상품을 모두 제거해주신 뒤 재시도 해주세요.',
        };
      }

      if (category.level !== 3) {
        const childCategories = await this.categoryRepository.find({
          where: {
            parentCategoryId: category.id,
            businessId,
          },
        });

        if (childCategories.length !== 0) {
          return {
            ok: false,
            error: '하위에 속해있는 카테고리를 모두 삭제 후 재시도 해주세요.',
          };
        }
      }

      await this.categoryRepository.delete({ id });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getCategory({
    id,
    token,
    businessId,
  }: GetCategoryInput): Promise<GetCategoryOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const category = await this.categoryRepository.findOne({ where: { id } });

      if (category.businessId != businessId) {
        return { ok: false, error: '해당 카테고리에 대한 권한이 없습니다.' };
      }
      if (!category) {
        return { ok: false, error: '존재하지 않는 카테고리입니다.' };
      }
      return { ok: true, category };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getCategories({
    token,
    businessId,
  }: GetCategoriesInput): Promise<GetCategoriesOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const categories: CategoryResult[] = await this.categoryRepository.find({
        where: {
          businessId,
        },
        relations: {
          parentCategory: true,
        },
      });

      for (const category of categories) {
        const childCategories = await this.categoryRepository.find({
          where: {
            parentCategoryId: category.id,
            businessId,
          },
        });

        category.childCategories = childCategories;
      }

      return { ok: true, categories };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateCategory({
    token,
    businessId,
    name,
    id,
  }: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      await this.categoryRepository.update({ id, businessId }, { name });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
