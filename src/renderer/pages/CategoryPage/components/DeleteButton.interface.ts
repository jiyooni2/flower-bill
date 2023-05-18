import { Category } from 'main/category/entities/category.entity';
import { SetterOrUpdater } from 'recoil';

export interface DeleteButtonProps {
  clicked: boolean;
  categoryId: string;
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  setCategories: SetterOrUpdater<Category[]>;
  setLevelName: React.Dispatch<React.SetStateAction<string>>;
}
