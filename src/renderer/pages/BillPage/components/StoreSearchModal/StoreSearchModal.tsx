import { Modal, Input } from '@mui/material';
import styles from './StoreSearchModal.module.scss';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { SearchStoreOutput } from 'main/store/dtos/search-store.dto';
import { storeState } from 'renderer/recoil/states';
import { useSetRecoilState } from 'recoil';
import { Store } from 'main/store/entities/store.entity';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoreSearchModal = ({ isOpen, setIsOpen }: IProps) => {
  const [keyword, setKeyword] = useState<string>('');
  const [storeList, setStoreList] = useState<SearchStoreOutput['stores']>([]);
  const setStore = useSetRecoilState(storeState);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const onStoreClick = (store: Store) => {
    setStore(store);
    handleClose();
  };

  const searchStore = () => {
    window.electron.ipcRenderer.sendMessage('search-store', {
      keyword,
    });

    window.electron.ipcRenderer.on(
      'search-store',
      ({ ok, error, stores }: SearchStoreOutput) => {
        if (ok) {
          setStoreList(stores);
        } else {
          alert(error);
        }
      }
    );
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className={styles.modal_container}>
        <div>
          <Input onChange={handleChange} value={keyword} />
          <Button type="button" onClick={searchStore}>
            검색
          </Button>
        </div>
        <div>
          {storeList?.map((store) => (
            <div key={store.id}>
              <p>이름: {store.name}</p>
              <p>사업자: {store.owner}</p>
              <Button onClick={() => onStoreClick(store)}>선택</Button>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default StoreSearchModal;
