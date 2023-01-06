import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { AppDataSource, productService } from './../main';
import {
  DeleteCategoryInput,
  DeleteCategoryOutput,
} from './dtos/delete-category.dto';
import {
  CreateCategoryOutput,
  CreateCategoryInput,
} from './dtos/create-category.dto';

export class CategoryService {
  private readonly categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async createCategory({
    name,
    parentCategoryId,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
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
        })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteCategory({
    id,
  }: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        return { ok: false, error: '존재하지 않는 카테고리입니다.' };
      }

      if (category.level === 3) {
        //카테고리를 참조하는 상품이 아직 존재하는 경우, 삭제 불가?
        //참조하는 상품까지 삭제?
      } else {
        //상위 카테고리의 경우 자식 카테고리는 어떻게 처리할 것 인지?
      }

      await this.categoryRepository.delete({ id });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
