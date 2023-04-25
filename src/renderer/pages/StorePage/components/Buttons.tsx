import { Button } from "@mui/material";
import { CreateStoreOutput } from "main/store/dtos/create-store.dto";
import { DeleteStoreOutput } from "main/store/dtos/delete-store.dto";
import { GetStoresOutput } from "main/store/dtos/get-stores.dto";
import { Store } from "main/store/entities/store.entity";
import React from "react";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { businessState, tokenState } from "renderer/recoil/states";
import styles from '../StorePage.module.scss';
import { Inputs, StoreData } from "../types";
import { submitValidation } from "../validation";


type IProps = {
  clickedStore: Store;
  inputs: Inputs;
  errors: StoreData;
  stores: Store[];
  setStores: SetterOrUpdater<Store[]>;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  setErrors: React.Dispatch<React.SetStateAction<StoreData>>;
  setClickedStore: React.Dispatch<React.SetStateAction<Store>>;
}

const Buttons = ({ clickedStore, setClickedStore, inputs, setInputs, errors, setErrors, stores, setStores } : IProps) => {
  const token = useRecoilValue(tokenState)
  const business = useRecoilValue(businessState);

  const updateDataHandler = () => {
    const findIndex = stores.findIndex(
      (element) => element.id == clickedStore.id
    );
    const updateStore = [...stores];
    updateStore[Number(findIndex)] = {
      ...updateStore[Number(findIndex)],
      businessNumber: parseInt(inputs.storeNumber),
      name: inputs.storeName,
      owner: inputs.owner,
      address: inputs.address,
    };
    setStores(updateStore);
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
    setInputs({...inputs, clicked: false})
  };

  const addDataHandler = () => {
    if (
      stores.findIndex(
        (data) => data.businessNumber.toString() == inputs.storeNumber
      ) != -1
    ) {
      errors.storeNumber = '동일한 사업자 번호가 존재합니다.';
      return;
    }

    const validate = submitValidation( inputs.storeNumber, inputs.storeName, inputs.owner, inputs.address)
    if (validate.storeNumber || validate.storeName || validate.owner || validate.address) {
      setErrors({...inputs, ...validate});
      return;
    } else {
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

      window.electron.ipcRenderer.on(
        'create-store',
        ({ ok, error }: CreateStoreOutput) => {
          if (ok) {
            window.electron.ipcRenderer.sendMessage('get-stores', {
              token,
              businessId: business.id,
            });
            window.electron.ipcRenderer.on(
              'get-stores',
              (args: GetStoresOutput) => {
                setStores(args.stores as Store[]);
              }
            );
          }
          if (error) {
            console.log(error);
          }
        }
      );
    }
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

  const deleteDataHandler = () => {
    window.electron.ipcRenderer.sendMessage('delete-store', {
      token,
      businessId: business.id,
      id: clickedStore.id,
    });

    window.electron.ipcRenderer.on(
      'delete-store',
      ({ ok, error }: DeleteStoreOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-stores', {
            token,
            businessId: business.id,
          });
          window.electron.ipcRenderer.on(
            'get-stores',
            (args: GetStoresOutput) => {
              setStores(args.stores as Store[]);
            }
          );
        }
        if (error) {
          console.log(error);
        }
      }
    );


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
  )
};

export default Buttons;
