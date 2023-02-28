import { Store } from 'main/store/entities/store.entity';
import { atom } from 'recoil';
import { Product } from './../../main/product/entities/product.entity';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import { Category } from 'main/category/entities/category.entity';
import { Business } from 'main/business/entities/business.entity';

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
    bills: [],
  },
});

const storesState = atom<Store[]>({
  key: 'storesState',
  default: [],
})

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

const categoryState = atom<Category>({
  key: 'categoryState',
});

const categoriesState = atom<Category[]>({
  key: 'categoriesState',
  default: [],
});

const businessState = atom({
  key: 'businessState',
  default: {
    name: '',
    businessNumber: 0n,
    businessOwnerName: '',
    address: '',
  }
})

export { storeState, storesState, productsState, orderProductsState, memoState, categoryState, categoriesState, businessState };
