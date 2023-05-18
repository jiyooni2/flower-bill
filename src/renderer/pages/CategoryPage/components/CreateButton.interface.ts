import { Category } from "main/category/entities/category.entity";
import { SetterOrUpdater } from "recoil";

export interface CreateButtonProps {
  setAlert: React.Dispatch<React.SetStateAction<{
    success: string;
    error: string;
}>>;
  alert: {success: string; error: string; };
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  setCategories: SetterOrUpdater<Category[]>;
  setLevelName: React.Dispatch<React.SetStateAction<string>>;
  setParentCategoryName: React.Dispatch<React.SetStateAction<string>>;
  categoryName: string;
  parentCategoryId: number;

}
