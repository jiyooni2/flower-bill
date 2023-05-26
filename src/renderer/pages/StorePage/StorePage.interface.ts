import { Store } from 'main/store/entities/store.entity';

export interface StoreData {
  storeNumber: string;
  storeName: string;
  owner: string;
  address: string;
}

export interface InputProps extends StoreData {
  name: string;
  clicked: boolean;
  page: number;
}

export interface FormProps {
  setInputs: React.Dispatch<React.SetStateAction<InputProps>>;
  inputs: InputProps;
}

export interface TableProps extends FormProps {
  stores: Store[];
  setClickedStore: React.Dispatch<React.SetStateAction<Store>>;
}

export interface ButtonProps extends FormProps {
  clickedStore: Store;
  setClickedStore: React.Dispatch<React.SetStateAction<Store>>;
}
