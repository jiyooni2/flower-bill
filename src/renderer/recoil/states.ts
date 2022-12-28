import { Store } from 'main/store/entities/store.entity';
import { atom } from 'recoil';
import { Product } from './../../main/product/entities/product.entity';

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

export { storeState, productsState };
