import { Button } from '@mui/material';
import { CreateStoreOutput } from 'main/store/dtos/create-store.dto';
import { DeleteStoreOutput } from 'main/store/dtos/delete-store.dto';
import { GetStoresOutput } from 'main/store/dtos/get-stores.dto';
import { Store } from 'main/store/entities/store.entity';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, storesState, tokenState } from 'renderer/recoil/states';
import styles from '../StorePage.module.scss';
import { toast } from 'react-toastify';
import {
  UpdateStoreInput,
  UpdateStoreOutput,
} from 'main/store/dtos/update-store.dto';
import { ButtonProps } from '../StorePage.interface';

const Buttons = ({
  clickedStore,
  setClickedStore,
  inputs,
  setInputs,
}: ButtonProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [stores, setStores] = useRecoilState(storesState);
  const [alert, setAlert] = useState({ success: '', error: '' });

  useEffect(() => {
    const getStoresRemover = window.electron.ipcRenderer.on(
      'get-stores',
      ({ stores }: GetStoresOutput) => {
        setStores(stores);
      }
    );

    const updateStoreRemover = window.electron.ipcRenderer.on(
      'update-store',
      ({ ok, error }: UpdateStoreOutput) => {
        if (ok) {
          setAlert({ success: '스토어가 수정되었습니다.', error: '' });
          window.electron.ipcRenderer.sendMessage('get-stores', {
            token,
            businessId: business.id,
          });
          clear();
        } else if (error) {
          setAlert({ success: '', error });
        }
      }
    );

    const createStoreRemover = window.electron.ipcRenderer.on(
      'create-store',
      ({ ok, error }: CreateStoreOutput) => {
        if (ok) {
          setAlert({ success: '스토어가 생성되었습니다.', error: '' });
          window.electron.ipcRenderer.sendMessage('get-stores', {
            token,
            businessId: business.id,
          });
          clear();
        }
        if (error) {
          setAlert({ success: '', error });
        }
      }
    );

    const deleteStoreRemover = window.electron.ipcRenderer.on(
      'delete-store',
      ({ ok, error }: DeleteStoreOutput) => {
        if (ok) {
          setAlert({ success: '스토어가 삭제되었습니다.', error: '' });
          window.electron.ipcRenderer.sendMessage('get-stores', {
            token,
            businessId: business.id,
          });
          clear();
        } else if (error) {
          console.log(error);
          setAlert({ success: '', error });
        }
      }
    );

    return () => {
      getStoresRemover();
      updateStoreRemover();
      createStoreRemover();
      deleteStoreRemover();
    };
  }, []);

  useEffect(() => {
    if (alert.error && !alert.success) {
      if (alert.error.startsWith('네트워크')) {
        toast.error(alert.error.split('네트워크')[1], {
          autoClose: 10000,
          position: 'top-right',
          hideProgressBar: true,
        });
      } else {
        toast.error(alert.error, {
          autoClose: 3000,
          position: 'top-right',
        });
      }
    } else if (alert.success && !alert.error) {
      toast.success(alert.success, {
        autoClose: 2000,
        position: 'top-right',
      });
    }
  }, [alert]);

  const clear = () => {
    setInputs({
      ...inputs,
      clicked: false,
      storeNumber: '',
      storeName: '',
      owner: '',
      address: '',
    });
    setClickedStore({
      business: null,
      businessId: null,
      businessNumber: 0,
      name: '',
      owner: '',
      address: '',
    });
  };

  const updateDataHandler = () => {
    const updateData: UpdateStoreInput = {
      businessNumber: parseInt(inputs.storeNumber),
      name: inputs.storeName,
      address: inputs.address,
      owner: inputs.owner,
      id: clickedStore.id,
      businessId: business.id,
      token,
    };
    window.electron.ipcRenderer.sendMessage('update-store', updateData);
  };

  const addDataHandler = () => {
    if (
      stores.findIndex(
        (data) => data.businessNumber.toString() == inputs.storeNumber
      ) != -1
    ) {
      setAlert({ success: '', error: '동일한 사업자 번호가 존재합니다.' });
      return;
    }

    const newData: Store = {
      name: inputs.storeName,
      businessNumber: parseInt(inputs.storeNumber),
      owner: inputs.owner,
      address: inputs.address,
      business: business,
      businessId: business.id,
    };

    window.electron.ipcRenderer.sendMessage('create-store', {
      ...newData,
      token,
      businessId: business.id,
    });
  };

  const deleteDataHandler = () => {
    window.electron.ipcRenderer.sendMessage('delete-store', {
      token,
      businessId: business.id,
      id: clickedStore.id,
    });
  };

  return (
    <div className={styles.buttonList}>
      {inputs.clicked ? (
        <Button
          variant="contained"
          size="small"
          sx={{ marginLeft: '40px' }}
          color="error"
          onClick={deleteDataHandler}
        >
          삭제
        </Button>
      ) : (
        <div></div>
      )}
      {!inputs.clicked ? (
        <Button
          variant="contained"
          size="small"
          type="submit"
          sx={{ marginRight: '10px' }}
          onClick={addDataHandler}
        >
          생성
        </Button>
      ) : (
        <Button
          variant="contained"
          size="small"
          sx={{ marginRight: '10px', background: 'coral' }}
          onClick={updateDataHandler}
        >
          수정
        </Button>
      )}
    </div>
  );
};

export default Buttons;
