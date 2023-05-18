import { Category } from 'main/category/entities/category.entity';
import { SetterOrUpdater } from 'recoil';

export interface UpdateButtonProps {
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
  categoryName: string;
  categoryId: string;
  setCategories: SetterOrUpdater<Category[]>;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  setLevelName: React.Dispatch<React.SetStateAction<string>>;
  disable: boolean;
}
