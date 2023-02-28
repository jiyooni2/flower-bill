import { Store } from 'main/store/entities/store.entity';
import { atom } from 'recoil';
import { Product } from './../../main/product/entities/product.entity';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import { Category } from 'main/category/entities/category.entity';

const storeState = atom<Store>({
  key: 'storeState',
  default: {
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: '',
    businessNumber: 0,
    owner: '',
    address: '',
    bills: [],
  },
});

const productsState = atom<Product[]>({
  key: 'productsState',
  default: [],
});

const orderProductsState = atom<OrderProduct[]>({
  key: 'orderProductsState',
  default: [],
});

const memoState = atom<string>({
  key: 'memoState',
  default: '',
});

const categoryState = atom<Category[]>({
  key: 'categoryState',
  default: [],
});

const loginState = atom<Boolean>({
  key: 'loginState',
  default: false,
});

const tokenState = atom<String>({
  key: 'tokenState',
  default: '',
});

const businessState = atom<Number>({
  key: 'businessState',
  default: -1,
});

export {
  storeState,
  productsState,
  orderProductsState,
  memoState,
  categoryState,
  loginState,
  tokenState,
  businessState,
};
