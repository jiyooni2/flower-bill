import { Store } from 'main/store/entities/store.entity';
import { atom } from 'recoil';

const storeState = atom<Store>({
  key: 'storeState',
  default: {
    id: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: '',
    businessNumber: undefined,
    owner: '',
    address: '',
  },
});

export { storeState };
