export interface Bill {
  store: Store;
  memo?: string;
  transactionDate?: Date;
  orderProducts: OrderProduct[];
}

export interface Store {
  businessNumber: number;
  address: string;
  name: string;
  owner: string;
  bills: Bill[];
}

export interface CreateStore
  extends Pick<Store, 'name' | 'owner' | 'address'> {
  businessNumber: string;
}

export interface OrderProduct {
  count: number;
  transactionDate?: Date;
  product: Product;
  bill?: Bill;
}

export interface Product {
  name: string;
  price: number;
  category: Category;
  orderProducts: OrderProduct[];
}

export interface Category {
  name: string;
  level: number;
  parentCategory: Category;
  childCategories: Category[];
  products: Product[];
}
