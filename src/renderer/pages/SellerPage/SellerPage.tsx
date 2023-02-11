import { ChangeEvent, useState } from 'react'
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

interface Users {
  id: number;
  storeName: string;
  name: string;
  storeNumber: string;
  owner: string;
  address: string;
}

const SellerPage = () => {
  const USERS = [
    {id: 1, storeName: '마장동에서 제일 잘나가는 꽃집', name: '홍길동1', storeNumber: '123', owner: '홍길동1', address: '서울시 성동구 마장동'},
    {id: 2, storeName: '꽃집1', name: '홍길동2', storeNumber: '456', owner: '홍길동2', address: '서울시 강동구 고덕동'},
    {id: 3, storeName: '집2', name: '홍길동3', storeNumber: '789', owner: '홍길동3', address: '경기도 군포시 산본동'},
  ];

  const [name, setName] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [foundUsers, setFoundUsers] = useState <Users[]>(USERS);
  const [StoreNumber, setStoreNumber] = useState<string>('');
  const [StoreName, setStoreName] = useState<string>('');
  const [Owner, setOwner] = useState<string>('');
  const [Address, setAddress] = useState<string>('');
  // const [storeInfo, setStoreInfo] = useState([
  //   { storeNumber: '', storeName: '', owner: '', address: '' },
  // ]);

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

    USERS.forEach((item) => {
      if (item.storeName === user.storeName) {
        setStoreNumber(item.storeNumber);
        setStoreName(item.storeName);
        setOwner(item.owner);
        setAddress(item.address)
      }
    });
  };

  const changeStoreDataHandler = (event: React.ChangeEvent<HTMLInputElement>, dataName:string) => {
    if (dataName === 'storeNumber') {
      setStoreNumber(event.target.value);
    } else if (dataName === 'storeName') {
      setStoreName(event.target.value);
    } else if (dataName === 'owner') {
      setOwner(event.target.value);
    } else if (dataName === 'address'){
      setAddress(event.target.value)
    }
  };

  const doubleClickHandler = () => {
    setClicked(false)
  }

  const clearInputs = () => {
    setClicked(false)

    setStoreNumber('')
    setStoreName('')
    setOwner('')
    setAddress('')
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="searchInputs">
          <input
            type="search"
            value={name}
            onChange={filter}
            placeholder="판매처 검색"
            className={styles.searchInput}
          />
          {/* <Button sx={{ color: 'black', marginLeft: '-14%', paddingTop: '8%' }}>
            검색
          </Button> */}
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
                      <TableCell component="th" align="left">
                        가게 번호
                      </TableCell>
                      <TableCell component="th" align="left">
                        가게명
                      </TableCell>
                      <TableCell component="th" align="left">
                        사업자
                      </TableCell>
                      <TableCell component="th" align="left">
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
                          data-value={user.storeName}
                          onClick={(event) => changeDataHandler(event, user)}
                          sx={{
                            '& th': {
                              fontSize: '14px',
                            },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {user.storeNumber}
                          </TableCell>
                          <TableCell component="th" align="left">
                            {user.storeName}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            className={styles.cutText}
                          >
                            {user.owner}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            className={styles.cutText}
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
                  <div className={styles.item}>
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
                  <div className={styles.item}>
                    <p className={styles.labels}>사업장 이름</p>
                    <input
                      value={StoreName}
                      className={styles.dataInput}
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
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'owner')
                      }
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>사업장 주소</p>
                    <input
                      value={Address}
                      className={styles.dataInput}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'address')
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.buttonList}>
              <Button variant="contained">삭제</Button>
              <Button variant="contained">수정</Button>
              <Button variant="contained">생성</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
