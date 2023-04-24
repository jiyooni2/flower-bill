import { Store } from 'main/store/entities/store.entity';
import { atom } from 'recoil';
import { Product } from './../../main/product/entities/product.entity';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import { Category } from 'main/category/entities/category.entity';
import { Business } from 'main/business/entities/business.entity';
import { Bill } from 'main/bill/entities/bill.entity';

const storeState = atom<Store>({
  key: 'storeState',
  default: {
    id: 0,
    businessId: 0,
    business: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: '',
    businessNumber: 0,
    owner: '',
    address: '',
  },
});

const storesState = atom<Store[]>({
  key: 'storesState',
  default: [],
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

const categoriesState = atom<Category[]>({
  key: 'categoriesState',
  default: [],
});

const tokenState = atom<string>({
  key: 'tokenState',
  default: '',
});

const businessState = atom<Business>({
  key: 'businessState',
  default: {
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: '',
    businessNumber: 0,
    businessOwnerName: '',
    address: '',
    owner: null,
    ownerId: 0,
  },
});

const businessesState = atom<Business[]>({
  key: 'businessesState',
  default: [],
});

const billState = atom<Bill>({
  key: 'billState',
  default: {
    memo: '',
    store: {
      businessNumber: 0,
      name: '',
      owner: '',
      business: null,
      businessId: 0,
    },
    business: {
      name: '',
      businessNumber: 0,
      businessOwnerName: '',
      address: '',
      owner: null,
      ownerId: 0,
    },
    businessId: 0,
  },
});

const billListState = atom<Bill[]>({
  key: 'billListState',
  default: [],
});

export {
  tokenState,
  memoState,
  storeState,
  storesState,
  productsState,
  orderProductsState,
  categoriesState,
  businessState,
  businessesState,
  billState,
  billListState,
};
