import { ChangeEvent, useEffect, useState } from 'react';
import styles from './StorePage.module.scss';
import { Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, storesState, tokenState } from 'renderer/recoil/states';
import { Store } from 'main/store/entities/store.entity';
import { GetStoresOutput } from 'main/store/dtos/get-stores.dto';
import { SearchStoreOutput } from 'main/store/dtos/search-store.dto';
import StoreInput from './components/StoreInput';
import { Inputs, StoreData } from './types';
import Buttons from './components/Buttons';
import StoreTable from './components/StoreTable';

const StorePage = () => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [stores, setStores] = useRecoilState(storesState);
  const [errors, setErrors] = useState<StoreData>({
    storeNumber: '',
    storeName: '',
    owner: '',
    address: '',
  });
  const [inputs, setInputs] = useState<Inputs>({
    storeNumber: '',
    storeName: '',
    owner: '',
    address: '',
    name: '',
    clicked: false,
  })
  const [clickedStore, setClickedStore] = useState<Store>({
    id: 0,
    business: null,
    businessId: null,
    businessNumber: 0,
    name: '',
    owner: '',
    address: '',
  });

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-stores', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on('get-stores', (args: GetStoresOutput) => {
      setStores(args.stores as Store[]);
    });
  }, []);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({...inputs, name: e.target.value})
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      window.electron.ipcRenderer.sendMessage('search-store', {
        keyword: name,
        businessId: business.id,
        token,
      });

      window.electron.ipcRenderer.on(
        'search-store',
        ({ ok, error, stores }: SearchStoreOutput) => {
          if (ok) {
            setStores(stores);
          } else {
            console.error(error);
          }
        }
      );
    }
  };

  const clearInputs = () => {
    setErrors({ ...errors, storeNumber: '', storeName: '', owner: '', address: '' });
    setInputs({...inputs, clicked: false, storeNumber: '', storeName: '', owner: '', address: ''})
    setClickedStore({
      business: null,
      businessId: null,
      businessNumber: 0,
      name: '',
      owner: '',
      address: '',
    });
  };


  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <input
              type="search"
              value={inputs.name}
              onChange={filter}
              placeholder="판매처 검색"
              onKeyDown={keyHandler}
              className={styles.searchInput}
            />
            <div className={styles.userList}>
              <StoreTable stores={stores} setInputs={setInputs} setClickedStore={setClickedStore} inputs={inputs} />
            </div>
          </div>
          <div>
            <div className={styles.infoContent}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginTop: '20px',
                }}
              >
                판매처 정보
              </Typography>
              <button className={styles.clearInput} onClick={clearInputs}>
                비우기
              </button>
              <div className={styles.list}>
                <StoreInput setErrors={setErrors} setInputs={setInputs} errors={errors} inputs={inputs} />
                <Buttons
                  clickedStore={clickedStore}
                  setClickedStore={setClickedStore}
                  inputs={inputs} setInputs={setInputs}
                  errors={errors} setErrors={setErrors}
                  stores={stores} setStores={setStores}  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StorePage;
