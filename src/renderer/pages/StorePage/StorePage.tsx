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


const StorePage = () => {
  const business = useRecoilValue(businessState)
  const token = useRecoilValue(tokenState)
  const [stores, setStores] = useRecoilState(storesState);
  const [name, setName] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [numberHasError, setNumberHasError] = useState<boolean>(false);
  const [addressHasError, setAddressHasError] = useState<boolean>(false);
  const [StoreNumber, setStoreNumber] = useState<number>();
  const [StoreName, setStoreName] = useState<string>('');
  const [Owner, setOwner] = useState<string>('');
  const [Address, setAddress] = useState<string>('');
  const [clickedStore, setClickedStore] = useState<Store>({
    business: null,
    businessId: null,
    businessNumber: 0,
    name: '',
    owner: '',
    address: '',
    bills: null,
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
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = stores.filter((store) => {
        return store.name.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setStores(results);
    } else {
      setStores(stores);
    }

    setName(keyword);
  };


  const changeDataHandler = (event: React.MouseEvent<unknown>, data: Store ) => {
    setClicked(true)

    stores.forEach((item) => {
      if (item.name === data.name) {
        setStoreNumber(item.businessNumber);
        setStoreName(item.name);
        setOwner(item.owner);
        setAddress(item.address);
        setClickedStore(
          {
            business: item.business,
            businessId: item.businessId,
            businessNumber: item.businessNumber,
            name: item.name,
            owner: item.owner,
            address: item.address,
            bills: item.bills,
          },
        );
      }
    });
  };

  const deleteDataHandler = () => {
    setStores(stores.filter((store) => store.name !== clickedStore.name));
  };

  const changeStoreDataHandler = (event: React.ChangeEvent<HTMLInputElement>, dataName:string) => {
    if (dataName === 'storeNumber') {
      if (event.target.value == ''){
        setNumberHasError(false)
      }
      setStoreNumber(parseInt(event.target.value));
    } else if (dataName === 'storeName') {
      setStoreName(event.target.value);
    } else if (dataName === 'owner') {
      setOwner(event.target.value);
    } else if (dataName === 'address'){
      if (event.target.value == '') {
        setAddressHasError(false);
      }
      setAddress(event.target.value);
    }
  };

  const clearInputs = () => {
    setClicked(false)

    setStoreNumber(0)
    setStoreName('')
    setOwner('')
    setAddress('')
    setClickedStore(
      {
        business: null,
        businessId: null,
        businessNumber: 0,
        name: '',
        owner: '',
        address: '',
        bills: null,
      },
    );
  };

  const addDataHandler = () => {
    if (
      stores.findIndex((data) => data.businessNumber == StoreNumber) != -1
    ) {
      setNumberHasError(true);
    } else if (stores.findIndex((data) => data.address == Address) != -1) {
      setAddressHasError(true);
    } else {
      if (StoreName != '' && StoreNumber != 0 && Owner != '' && Address != '') {
        const newData: Store = {
          name: StoreName,
          businessNumber: StoreNumber,
          owner: Owner,
          address: Address,
          bills: null,
          business: business,
          businessId: business.id,
        };

        window.electron.ipcRenderer.sendMessage('create-store', {
          ...newData,
          token,
          businessId: business.id
        });

        window.electron.ipcRenderer.on(
          'create-store',
          ({ ok, error }: CreateStoreOutput) => {
            if (ok) {
              window.electron.ipcRenderer.sendMessage('get-stores', {
                token,
                businessId: business.id
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
        )
        clearInputs();
      }
    }
  };

  const doubleClickHandler = () => {
    setClicked(false);
    console.log(clickedStore)
  };

  const updateDataHandler = () => {
    const findIndex = stores.findIndex(
      (element) => element.businessNumber == clickedStore.businessNumber
    );
      stores[findIndex] = {
        ...stores[findIndex],
        businessNumber: StoreNumber,
        name: StoreName,
        owner: Owner,
        address: Address,
      };
      setStores(stores);
    setClicked(true)
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <input
            type="search"
            value={name}
            onChange={filter}
            placeholder="판매처 검색"
            className={styles.searchInput}
          />
          <Button
            sx={{ color: 'black', marginLeft: '-3rem', paddingTop: '25px' }}
          >
            검색
          </Button>
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
                        sx={{ width: '15%' }}
                      >
                        사업자 번호
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '35%' }}
                      >
                        가게명
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '20%' }}
                      >
                        사업자
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '30%' }}
                      >
                        가게 주소
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stores &&
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
                            sx={{ width: '15%' }}
                          >
                            {store.businessNumber}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            sx={{ width: '35%' }}
                          >
                            {store.name}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            sx={{ width: '20%' }}
                          >
                            {store.owner}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            className={styles.cutText}
                            sx={{ width: '30%' }}
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
              판매자 정보
            </Typography>
            <button className={styles.clearInput} onClick={clearInputs}>
              비우기
            </button>
            <div className={styles.list}>
              <div>
                <div>
                  <div className={styles.itemWithError}>
                    <p className={styles.labels}>사업자 번호</p>
                    <input
                      value={StoreNumber || 0}
                      className={styles.dataInput}
                      onDoubleClick={doubleClickHandler}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'storeNumber')
                      }
                    />
                  </div>
                  {numberHasError ? (
                    <p className={styles.errorMessage}>
                      동일한 가게 번호가 이미 존재하고 있습니다.
                    </p>
                  ) : (
                    <p className={styles.item}></p>
                  )}
                  <div className={styles.item}>
                    <p className={styles.labels}>사업장 이름</p>
                    <input
                      value={StoreName}
                      className={styles.dataInput}
                      onDoubleClick={doubleClickHandler}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'storeName')
                      }
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>소유자 이름</p>
                    <input
                      value={Owner}
                      className={styles.dataInput}
                      onDoubleClick={doubleClickHandler}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'owner')
                      }
                    />
                  </div>
                  <div className={styles.itemWithError}>
                    <p className={styles.labels}>사업장 주소</p>
                    <input
                      value={Address}
                      className={styles.dataInput}
                      onDoubleClick={doubleClickHandler}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'address')
                      }
                    />
                  </div>
                  {addressHasError ? (
                    <p className={styles.errorMessage}>
                      동일한 가게 주소가 이미 존재하고 있습니다.
                    </p>
                  ) : (
                    <p className={styles.item}></p>
                  )}
                </div>
              </div>
              <div className={styles.buttonList}>
                {clickedStore.businessNumber > 0 ? (
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
                {clickedStore ? (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginRight: '10px' }}
                    onClick={addDataHandler}
                  >
                    생성
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginRight: '10px' }}
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
  );
};

export default StorePage;
