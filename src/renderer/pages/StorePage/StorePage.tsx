import { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './StorePage.module.scss';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, storesState, tokenState } from 'renderer/recoil/states';
import { Store } from 'main/store/entities/store.entity';
import { GetStoresOutput } from 'main/store/dtos/get-stores.dto';
import { CreateStoreOutput } from 'main/store/dtos/create-store.dto';
import { SearchStoreOutput } from 'main/store/dtos/search-store.dto';
import Validation from 'renderer/hooks/Validations/storeValidation';

type StoreData = {
  storeNumber?: string;
  storeName?: string;
  owner?: string;
  address?: string;
};

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
  const [storeNumber, setStoreNumber] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
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
    setName(e.target.value);
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

  const changeDataHandler = (event: React.MouseEvent<unknown>, data: Store) => {
    setClicked(true);

    stores.forEach((item) => {
      if (item.name === data.name) {
        setStoreNumber(item.businessNumber.toString());
        setStoreName(item.name);
        setOwner(item.owner);
        setAddress(item.address);
        setClickedStore({
          id: data.id,
          business: item.business,
          businessId: item.businessId,
          businessNumber: item.businessNumber,
          name: item.name,
          owner: item.owner,
          address: item.address,
        });
      }
    });
  };

  const deleteDataHandler = () => {
    setStores(stores.filter((store) => store.name !== clickedStore.name));
  };

  const changeStoreDataHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    dataName: string
  ) => {
    const { value } = event.target;

    if (dataName === 'storeNumber') {
      const numPattern = /^[0-9]*$/;
      if (!numPattern.test(value)) {
        setErrors({
          ...errors,
          storeNumber: '숫자 외의 문자는 작성하실 수 없습니다.',
        });
      } else if (value.startsWith('0')) {
        setErrors({
          ...errors,
          storeNumber: '첫 번쨰 자리는 0이 될 수 없습니다.',
        });
      } else if (value == '' || value) {
        setErrors({ ...errors, storeNumber: '' });
        setStoreNumber(value);
      }
    } else if (dataName === 'storeName') {
      const namePattern = /^[ㄱ-ㅎ가-힣0-9a-zA-Z\s]*$/;
      if (!namePattern.test(value)) {
        setErrors({
          ...errors,
          storeName: '공백 외의 특수문자는 작성하실 수 없습니다.',
        });
      } else if (value.startsWith(' ')) {
        setErrors({
          ...errors,
          storeName: '첫 번째 자리는 공백이 될 수 없습니다.',
        });
      } else if (value.length > 30) {
        setErrors({
          ...errors,
          storeName: '최대 30글자까지 작성하실 수 있습니다.',
        });
      } else if (value == '' || value) {
        setErrors({ ...errors, storeName: '' });
        setStoreName(value);
      }
    } else if (dataName === 'owner') {
      const namePattern = /^[ㄱ-ㅎ가-힣a-zA-Z]*$/;
      if (!namePattern.test(value)) {
        setErrors({
          ...errors,
          owner: '한글, 영문 이외의 문자는 성함에 포함될 수 없습니다.',
        });
      } else if (value == '' || value) {
        setErrors({ ...errors, owner: '' });
        setOwner(value);
      }
    } else if (dataName === 'address') {
      const addressPattern = /^[ㄱ-ㅎ가-힣a-zA-Z_-]*$/;
      if (value) {
        if (!addressPattern.test(value)) {
          setErrors({ ...errors, address: '특수문자는 -와 _만 입력 가능합니다' });
        }
        else {
          setErrors({ ...errors, address: '' });
          setAddress(value);
        }
      } else if (value == "") {
        setErrors({ ...errors, address: '' });
        setAddress('');
      }
    }
  };

  const clearInputs = () => {
    setClicked(false);

    setErrors({ storeNumber: '', storeName: '', owner: '', address: '' });
    setStoreNumber('');
    setStoreName('');
    setOwner('');
    setAddress('');
    setClickedStore({
      business: null,
      businessId: null,
      businessNumber: 0,
      name: '',
      owner: '',
      address: '',
    });
  };

  const addDataHandler = () => {
    setErrors(Validation({ storeNumber, storeName, owner, address }));
    if (
      stores.findIndex(
        (data) => data.businessNumber.toString() == storeNumber
      ) != -1
    ) {
      errors.storeNumber = '동일한 사업자 번호가 존재합니다.';
      return;
    }

    if (
      errors.address.length == 0 &&
      errors.owner.length == 0 &&
      errors.storeName.length == 0 &&
      errors.storeNumber.length == 0
    ) {
      if (
        storeName != '' &&
        storeNumber != '' &&
        owner != ''
      ) {
        const newData: Store = {
          name: storeName,
          businessNumber: parseInt(storeNumber),
          owner: owner,
          address: address,
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
        clearInputs();
      }
    }
  };

  const updateDataHandler = () => {
    const findIndex = stores.findIndex(
      (element) => element.id == clickedStore.id
    );
    const updateStore = [...stores];
    updateStore[Number(findIndex)] = {
      ...updateStore[Number(findIndex)],
      businessNumber: parseInt(storeNumber),
      name: storeName,
      owner: owner,
      address: address,
    };
    setStores(updateStore);
    clearInputs();
    setClicked(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <input
              type="search"
              value={name}
              onChange={filter}
              placeholder="판매처 검색"
              onKeyDown={keyHandler}
              className={styles.searchInput}
            />
            <div className={styles.userList}>
              <div>
                <TableContainer sx={{ width: '100%' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          borderBottom: '1.5px solid black',
                          backgroundColor: 'lightgray',
                          '& th': {
                            fontSize: '14px',
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '27%' }}
                        >
                          사업자번호
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '27%' }}
                        >
                          상호
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '25%' }}
                        >
                          사업자명
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '35%' }}
                        >
                          소재지
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stores != undefined &&
                        stores.length > 0 &&
                        stores.map((store) => (
                          <TableRow
                            key={store.businessNumber}
                            className={styles.dataRow}
                            onClick={(event) => changeDataHandler(event, store)}
                            sx={{
                              '& th': {
                                fontSize: '14px',
                              },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              // sx={{ width: '15%' }}
                            >
                              {store.businessNumber}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                              // sx={{ width: '35%' }}
                            >
                              {store.name}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                              // sx={{ width: '20%' }}
                            >
                              {store.owner}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                              className={styles.cutText}
                              // sx={{ width: '30%' }}
                            >
                              {store.address}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {stores && stores.length == 0 && (
                  <div className={styles.noResult}>
                    <div>
                      <h3>검색결과가 없습니다.</h3>
                    </div>
                  </div>
                )}
              </div>
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
                <div>
                  <div>
                    <div
                      className={
                        errors.storeNumber.length > 0
                          ? styles.itemWithError
                          : styles.item
                      }
                    >
                      <p className={styles.labels}>사업자 번호</p>
                      <input
                        name="storeNumber"
                        value={storeNumber}
                        className={
                          errors.storeNumber.length > 0
                            ? styles.hasError
                            : styles.dataInput
                        }
                        onChange={(event) =>
                          changeStoreDataHandler(event, 'storeNumber')
                        }
                        maxLength={10}
                      />
                    </div>
                    {errors.storeNumber && (
                      <span className={styles.errorMessage}>
                        {errors.storeNumber}
                      </span>
                    )}
                    <div
                      className={
                        errors.storeName.length > 0
                          ? styles.itemWithError
                          : styles.item
                      }
                    >
                      <p className={styles.labels}>상호</p>
                      <input
                        name="storeName"
                        value={storeName}
                        className={
                          errors.storeName.length > 0
                            ? styles.hasError
                            : styles.dataInput
                        }
                        onChange={(event) =>
                          changeStoreDataHandler(event, 'storeName')
                        }
                      />
                    </div>
                    {errors.storeName && (
                      <p className={styles.errorMessage}>{errors.storeName}</p>
                    )}
                    <div
                      className={
                        errors.owner.length > 0
                          ? styles.itemWithError
                          : styles.item
                      }
                    >
                      <p className={styles.labels}>사업자 성명</p>
                      <input
                        name="owner"
                        value={owner}
                        className={
                          errors.owner.length > 0
                            ? styles.hasError
                            : styles.dataInput
                        }
                        onChange={(event) =>
                          changeStoreDataHandler(event, 'owner')
                        }
                        maxLength={25}
                      />
                    </div>
                    {errors.owner && (
                      <p className={styles.errorMessage}>{errors.owner}</p>
                    )}
                    <div
                      className={
                        errors.address.length > 0
                          ? styles.itemWithError
                          : styles.item
                      }
                    >
                      <p className={styles.labels}>
                        사업장 소재지
                        <br />
                        <span style={{ fontSize: '12px'}}>(선택)</span>
                      </p>
                      <input
                        name="address"
                        value={address}
                        className={
                          errors.address.length > 0
                            ? styles.hasError
                            : styles.dataInput
                        }
                        onChange={(event) =>
                          changeStoreDataHandler(event, 'address')
                        }
                        maxLength={50}
                      />
                    </div>
                    {errors.address && (
                      <p className={styles.errorMessage}>{errors.address}</p>
                    )}
                  </div>
                </div>
                <div className={styles.buttonList}>
                  {clicked ? (
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
                  {!clicked ? (
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
                      sx={{ marginRight: '10px', backgroundColor: 'coral' }}
                      onClick={updateDataHandler}
                    >
                      수정
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StorePage;
