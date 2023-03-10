import { ArrowBackRounded, Label } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { billState, businessState, storesState, tokenState } from "renderer/recoil/states";
import BillPartPage from "./UpdateBill/BillPartPage";
import { useEffect, useState } from "react";
import styles from './UpdateBillpage.module.scss'
import { Button, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Store } from "main/store/entities/store.entity";
import { GetStoresOutput } from "main/store/dtos/get-stores.dto";

const UpdateBillPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState)
  const bill = useRecoilValue(billState)
  const [clicked, setClicked] = useState<boolean>(false);
  const [stores, setStores] = useRecoilState(storesState);
  const [memo, setMemo] = useState<string>(bill.memo);
  const [storeId, setStoreId] = useState<number>(bill.storeId)
  const [storeName, setStoreName] = useState<string>(bill.store.name)

  console.log(clicked)

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-stores', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on('get-stores', (args: GetStoresOutput) => {
      setStores(args.stores as Store[]);
    });
  }, [])

  const changeMemoHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value)
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const {value} = e.target;

    if (name === 'storeID'){
      if (!Number.isInteger(Number(value))) setStoreId(0);
      else setStoreId(Number(value));
      stores.map((item) => {
        if (item.id === Number(value)){
          setStoreName(item.name)
        }
      })
    }
  };

  return (
    <>
      <div className={styles.container}>
        <p>
          <Link to={'/bills'}>
            <ArrowBackRounded
              fontSize="large"
              sx={{
                marginTop: '-6px',
                cursor: 'pointer',
                fontSize: '50px',
                width: '50px',
              }}
            />
          </Link>
        </p>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
          <div className={styles.content_container}>
            <BillPartPage />
          </div>
          <div style={{ width: '55%' }}>
            {!clicked ? (
              <Typography
                variant="h5"
                align="center"
                sx={{ marginBottom: '30px' }}
              >
                기본 정보
              </Typography>
            ) : (
              <Typography
                variant="h5"
                align="center"
                sx={{ marginBottom: '20px' }}
              >
                상품 정보 수정하기
              </Typography>
            )}
            {!clicked ? (
              <div>
                {/* <div className={styles.item}>
                <p className={styles.labels}>거래일</p>
                <input
                  value={memo}
                  className={styles.dataInput}
                  onChange={(event) => changeDateHandler(event)}
                />
              </div> */}
                <div className={styles.item}>
                  <p className={styles.labels}>메모</p>
                  <textarea
                    value={memo}
                    className={styles.memoInput}
                    onChange={(event) => changeMemoHandler(event)}
                  />
                </div>
                <div className={styles.item}>
                  <p className={styles.labels}>거래처 ID</p>
                  <input
                    value={storeId}
                    className={styles.dataInput}
                    onChange={(event) => changeHandler(event, 'storeID')}
                  />
                </div>
                <div className={styles.item}>
                  <p className={styles.labels}>거래처명</p>
                  <input
                    value={storeName}
                    className={styles.dataInput}
                    onChange={(event) => changeHandler(event, 'storeName')}
                    disabled
                    style={{ backgroundColor: 'white', color: 'black' }}
                  />
                </div>
                <hr style={{ marginBottom: '35px' }} />
              </div>
            ) : (
              <div style={{ marginBottom: '40px'}}>
                <TableContainer sx={{ width: '90%', marginLeft: '20px', height: '450px', overflow: 'auto' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: 'lightgray', opacity: '0.6' }}
                      >
                        <TableCell width={'20%'} sx={{ fontSize: '13px' }}  align="center">
                          상품명
                        </TableCell>
                        <TableCell width={'15%'} sx={{ fontSize: '13px' }}  align="center">
                          수량
                        </TableCell>
                        <TableCell width={'20%'} sx={{ fontSize: '13px' }}  align="center">
                          판매가
                        </TableCell>
                        <TableCell width={'20%'} sx={{ fontSize: '12px' }}  align="center">
                          총 금액
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bill.orderProducts.map((item) => (
                        <TableRow
                          key={item.productId}
                          sx={{
                            '& th': { fontSize: '13px' },
                          }}
                        >
                          <TableCell component="th" align="center">
                            {item.product.name}
                          </TableCell>
                          <TableCell align="center"><input value={item.count} className={styles.countInput} /></TableCell>
                          <TableCell align="center">{item.product.price} 원</TableCell>
                          <TableCell align="center">{item.product.price * item.count} 원</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
            {!clicked ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => setClicked(true)}>
                  상품 목록 자세히 보기
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => setClicked(false)}>
                  기본 정보 수정하기
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateBillPage;
