import { Category } from 'main/category/entities/category.entity';
import { Product } from 'main/product/entities/product.entity';
import { SetterOrUpdater } from 'recoil';

export interface Input {
  id: number;
  name: string;
  price: string;
  keyword: string;
  categoryName: string;
  favorite: boolean;
  page: number;
  clicked: boolean;
}

export interface Error {
  name: string;
  price: string;
  category: string;
}

export interface TableProps {
  products: Product[];
  categories: Category[];
  inputs: Input;
  setInputs: React.Dispatch<React.SetStateAction<Input>>;
  setId: SetterOrUpdater<number>;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormProps {
  inputs: Input;
  setInputs: React.Dispatch<Input>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategoryId: SetterOrUpdater<number>;
  id: number;
  clicked: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryId: React.Dispatch<React.SetStateAction<number>>;
}
