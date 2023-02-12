import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './SellerPage.module.scss';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';

interface UserData {
  storeNumber: string;
  storeName: string;
  owner: string;
  address: string;
}

interface Users {
  id: number;
  storeName: string;
  name: string;
  storeNumber: string;
  owner: string;
  address: string;
}

const USERS = [
    {id: 1, storeName: '마장동에서 제일 잘나가는 꽃집', name: '홍길동1', storeNumber: '123', owner: '홍길동1', address: '서울시 성동구 마장동'},
    {id: 2, storeName: '꽃집1', name: '홍길동2', storeNumber: '456', owner: '홍길동2', address: '서울시 강동구 고덕동'},
    {id: 3, storeName: '집2', name: '홍길동3', storeNumber: '789', owner: '홍길동3', address: '경기도 군포시 산본동'},
  ];

const SellerPage = () => {
  const [name, setName] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [numberHasError, setNumberHasError] = useState<boolean>(false);
  const [addressHasError, setAddressHasError] = useState<boolean>(false);
  const [foundUsers, setFoundUsers] = useState <Users[]>(USERS);
  const [StoreNumber, setStoreNumber] = useState<string>('');
  const [StoreName, setStoreName] = useState<string>('');
  const [Owner, setOwner] = useState<string>('');
  const [Address, setAddress] = useState<string>('');
  const [clickedStore, setClickedStore] = useState<UserData[]>([
    {storeNumber: '', storeName: '', owner: '', address: '',}
  ]);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = USERS.filter((user) => {
        return user.storeName.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(USERS);
    }

    setName(keyword);
  };


  const changeDataHandler = (event: React.MouseEvent<unknown>, user: Users ) => {
    setClicked(true)

    foundUsers.forEach((item) => {
      if (item.storeName === user.storeName) {
        setStoreNumber(item.storeNumber);
        setStoreName(item.storeName);
        setOwner(item.owner);
        setAddress(item.address)
        setClickedStore(
          [{storeNumber : item.storeNumber, storeName: item.storeName, owner: item.owner, address: item.address}]
        )
      }
    });
  };

  const deleteDataHandler = () => {
    setFoundUsers(foundUsers.filter(user => user.storeName !== clickedStore[0].storeName))
  };

  const changeStoreDataHandler = (event: React.ChangeEvent<HTMLInputElement>, dataName:string) => {
    if (dataName === 'storeNumber') {
      if (event.target.value == ''){
        setNumberHasError(false)
      }
      setStoreNumber(event.target.value);
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

    setStoreNumber('')
    setStoreName('')
    setOwner('')
    setAddress('')
    setClickedStore([
      {
        storeNumber: '',
        storeName: '',
        owner: '',
        address: '',
      },
    ]);
  };

  const addDataHandler = () => {
    if (foundUsers.findIndex(data => data.storeNumber == StoreNumber) != -1){
      setNumberHasError(true);
    }
    else if (foundUsers.findIndex(data => data.address == Address) != -1){
      setAddressHasError(true);
    }
    else if (foundUsers.findIndex(data => data.storeNumber == StoreNumber) == -1 && foundUsers.findIndex(data => data.address == Address) == -1){
      if (StoreName != '' && StoreNumber != '' && Owner != '' && Address != ''){
        const newData = {
          id: foundUsers.length + 1,
          storeName: StoreName,
          name: Owner,
          storeNumber: StoreNumber,
          owner: Owner,
          address: Address,
        };
        setFoundUsers((userData) => [...userData, newData]);
        clearInputs();
      }
    }
  };

  const doubleClickHandler = () => {
    setClicked(false);
    console.log(clickedStore[0])
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, name: string) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      if (name === 'storeNumber') {
        const findIndex = foundUsers.findIndex(element => element.storeNumber == clickedStore[0].storeNumber)
        foundUsers[findIndex] = {...foundUsers[findIndex], storeNumber: StoreNumber}
        setFoundUsers(foundUsers)
      } else if (name === 'storeName') {
        const findIndex = foundUsers.findIndex(element => element.storeName == clickedStore[0].storeName)
        foundUsers[findIndex] = {...foundUsers[findIndex], storeName: StoreName}
        setFoundUsers(foundUsers);
      } else if (name === 'owner') {
        const findIndex = foundUsers.findIndex(element => element.owner == clickedStore[0].owner)
        foundUsers[findIndex] = {...foundUsers[findIndex], owner: Owner}
        setFoundUsers(foundUsers);
      } else if (name === 'address') {
        const findIndex = foundUsers.findIndex(element => element.address == clickedStore[0].address)
        foundUsers[findIndex] = {...foundUsers[findIndex], address: Address}
        setFoundUsers(foundUsers);
      }
      setClicked(true)
      console.log(foundUsers);
    }
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
                    {foundUsers &&
                      foundUsers.length > 0 &&
                      foundUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className={styles.dataRow}
                          onClick={(event) => changeDataHandler(event, user)}
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
                            {user.storeNumber}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            sx={{ width: '35%' }}
                          >
                            {user.storeName}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            sx={{ width: '20%' }}
                          >
                            {user.owner}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            className={styles.cutText}
                            sx={{ width: '30%' }}
                          >
                            {user.address}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {foundUsers && foundUsers.length == 0 && (
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
                      onKeyDown={(event) =>
                        handleKeyPress(event, 'storeNumber')
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
                      onKeyDown={(event) => handleKeyPress(event, 'storeName')}
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
                      onKeyDown={(event) => handleKeyPress(event, 'owner')}
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
                      onKeyDown={(event) => handleKeyPress(event, 'address')}
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
                {clickedStore[0].storeNumber.length > 0 ? (
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
                <Button
                  variant="contained"
                  size="small"
                  sx={{ marginRight: '10px' }}
                  onClick={addDataHandler}
                >
                  생성
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
