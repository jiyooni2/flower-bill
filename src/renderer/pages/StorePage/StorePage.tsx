import { ChangeEvent, useState } from 'react';
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
import { Store } from '../../types/index';

const STORE = [
  {
    businessNumber: 123,
    address: '서울시 성동구 마장동',
    name: '마장동에서 제일 잘나가는 꽃집',
    owner: '홍길동1',
    bills: null,
  },
  {
    businessNumber: 456,
    address: '서울시 강동구 고덕동',
    name: '꽃집1',
    owner: '홍길동2',
    bills: null,
  },
  {
    businessNumber: 789,
    address: '경기도 군포시 산본동',
    name: '집2',
    owner: '홍길동3',
    bills: null,
  },
];

const SellerPage = () => {
  const [name, setName] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [numberHasError, setNumberHasError] = useState<boolean>(false);
  const [addressHasError, setAddressHasError] = useState<boolean>(false);
  const [storeData, setStoreData] = useState < Store[]>(STORE);
  const [StoreNumber, setStoreNumber] = useState<number>();
  const [StoreName, setStoreName] = useState<string>('');
  const [Owner, setOwner] = useState<string>('');
  const [Address, setAddress] = useState<string>('');
  const [clickedStore, setClickedStore] = useState<Store[]>([
    { businessNumber: 0, name: '', owner: '', address: '', bills: null },
  ]);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = STORE.filter((store) => {
        return store.name.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setStoreData(results);
    } else {
      setStoreData(STORE);
    }

    setName(keyword);
  };


  const changeDataHandler = (event: React.MouseEvent<unknown>, data: Store ) => {
    setClicked(true)

    storeData.forEach((item) => {
      if (item.name === data.name) {
        setStoreNumber(item.businessNumber);
        setStoreName(item.name);
        setOwner(item.owner);
        setAddress(item.address);
        setClickedStore([
          {
            businessNumber: item.businessNumber,
            name: item.name,
            owner: item.owner,
            address: item.address,
            bills: null,
          },
        ]);
      }
    });
  };

  const deleteDataHandler = () => {
    setStoreData(
      storeData.filter((user) => user.name !== clickedStore[0].name)
    );
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
    setClickedStore([
      {
        businessNumber: 0,
        name: '',
        owner: '',
        address: '',
        bills: null,
      },
    ]);
  };

  const addDataHandler = () => {
    if (
      storeData.findIndex((data) => data.businessNumber == StoreNumber) != -1
    ) {
      setNumberHasError(true);
    } else if (storeData.findIndex((data) => data.address == Address) != -1) {
      setAddressHasError(true);
    } else if (
      storeData.findIndex((data) => data.businessNumber == StoreNumber) == -1 &&
      storeData.findIndex((data) => data.address == Address) == -1
    ) {
      if (StoreName != '' && StoreNumber != 0 && Owner != '' && Address != '') {
        const newData = {
          name: StoreName,
          businessNumber: StoreNumber,
          owner: Owner,
          address: Address,
          bills: null,
        };
        setStoreData((data) => [...data, newData]);
        clearInputs();
      }
    }
  };

  const doubleClickHandler = () => {
    setClicked(false);
    console.log(clickedStore[0])
  };

  const updateDataHandler = () => {
    const findIndex = storeData.findIndex(
      (element) => element.businessNumber == clickedStore[0].businessNumber
    );
      storeData[findIndex] = {
        ...storeData[findIndex],
        businessNumber: StoreNumber,
        name: StoreName,
        owner: Owner,
        address: Address,
      };
      setStoreData(storeData);
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
                        가게 번호
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
                    {storeData &&
                      storeData.length > 0 &&
                      storeData.map((store) => (
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
              {storeData && storeData.length == 0 && (
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
                      value={StoreNumber}
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
                {clickedStore[0].businessNumber > 0 ? (
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
                {clickedStore[0].businessNumber > 0 ? (
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

export default SellerPage;
