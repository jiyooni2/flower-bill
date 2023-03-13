import { Store } from 'main/store/entities/store.entity';
import { atom } from 'recoil';
import { Product } from './../../main/product/entities/product.entity';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import { Category } from 'main/category/entities/category.entity';
import { Business } from 'main/business/entities/business.entity';
import { Bill } from 'main/bill/entities/bill.entity';

const billProductsState = atom<Product[]>({
  key: 'billProductsState',
  default: [],
});

const billOrderProductsState = atom<OrderProduct[]>({
  key: 'billOrderProductsState',
  default: [],
});

const billOrderProductState = atom<OrderProduct>({
  key: 'billOrderProductState',
  default: {
    count: 0,
    orderPrice: 0,
    product: null,
    business: null,
    businessId: 0,
  },
});

const billMemoState = atom<string>({
  key: 'billMemoState',
  default: '',
});

export {
  billMemoState,
  billProductsState,
  billOrderProductsState,
  billOrderProductState,
};
