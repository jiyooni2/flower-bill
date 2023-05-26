import { Category } from 'main/category/entities/category.entity';
import { SetterOrUpdater } from 'recoil';

interface CategoryForm {
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  setLevelName: React.Dispatch<React.SetStateAction<string>>;
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
}

interface ButtonProps {
  alert: { success: string; error: string };
  setParentCategoryName: React.Dispatch<React.SetStateAction<string>>;
  parentCategoryId: number;
  categoryName: string;
}

export interface CreateButtonProps extends CategoryForm, ButtonProps {
  setCategories: SetterOrUpdater<Category[]>;
}

export interface ButtonsProps extends CategoryForm, ButtonProps {
  clicked: boolean;
  parentCategoryName: string;
  categoryId: string;
}

export interface DeleteButtonProps extends CategoryForm {
  clicked: boolean;
  categoryId: string;
  setCategories: SetterOrUpdater<Category[]>;
}

export interface UpdateButtonProps extends CategoryForm {
  categoryName: string;
  categoryId: string;
  setCategories: SetterOrUpdater<Category[]>;
  disable: boolean;
}
