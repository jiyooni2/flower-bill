import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import BillPartPage from '../BillPart/BillPartPage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { billState, orderProductsState } from 'renderer/recoil/states';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import { CheckCircleOutline, LocalPrintshopSharp } from '@mui/icons-material';
import { alertState } from 'renderer/recoil/bill-states';
import BillModal from './BillModal/BillModal';
import { useEffect, useRef, useState } from 'react';

const DetailBillPage = () => {
  const bill = useRecoilValue(billState)
  const orderProducts = useRecoilValue(orderProductsState)
  const [alert, setAlert] = useRecoilState(alertState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const printRef = useRef<HTMLElement>();
  const [updated, setUpdated] = useState<boolean>(false);

  useEffect(() => {
    bill.updatedAt.toISOString() !== bill.createdAt.toISOString()
      ? setUpdated(true)
      : setUpdated(false);
  }, [bill]);

  const date = new Date(bill.updatedAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (alert == true) {
    setTimeout(() => setAlert(false), 1500);
    setAlert(true)
  }

  const convertNumber = (number : number) => {
    const num = number.toString();
    return `${num.slice(0, 3)} - ${num.slice(3, 5)} - ${num.slice(5, 10)}`;
  }

  return (
    <>
      <BillModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        style={{
          justifyContent: 'none',
          width: '100%',
          height: '100%',
          marginTop: '-10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to={'/bills'}>
            <ArrowBackRoundedIcon
              fontSize="large"
              sx={{
                marginBottom: '8px',
                cursor: 'pointer',
                fontSize: '50px',
                width: '50px',
              }}
            />
          </Link>
          <Link to={'/update-bills'}>
            <Button
              sx={{
                margin: '16px 0px 8px 0px',
                cursor: 'pointer',
                fontSize: '13px',
                width: '150px',
                paddingLeft: '20px',
              }}
            >
              계산서 수정하기{' '}
              <ArrowRightAltIcon sx={{ color: 'black', marginLeft: '10px' }} />
            </Button>
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0px' }}>
          <div style={{ width: '11cm', margin: '1%' }}>
            <BillPartPage bill={bill} orderProducts={orderProducts} />
            {alert == false ? (
              <Button
                variant="contained"
                sx={{
                  width: '96%',
                  marginLeft: '3.5%',
                  fontSize: '15px',
                  height: '35px',
                }}
                onClick={() => setIsOpen(true)}
                startIcon={<LocalPrintshopSharp />}
              >
                프린트하기
              </Button>
            ) : (
              <span ref={printRef} style={{ color: 'green' }}>
                <CheckCircleOutline sx={{ color: 'forestgreen' }} />
              </span>
            )}
          </div>
          <div style={{ width: '100%' }}>
            <div
              style={{
                width: '100%',
                height: '59.3%',
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <div style={{ width: '80%', marginRight: '5px'}}>
                  <Card
                    sx={{
                      backgroundColor: 'floralwhite',
                      height: '100%',
                      marginBottom: '15px',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginLeft: '3px', fontSize: '15px' }}
                      >
                        사&nbsp;업&nbsp;자&nbsp;명&nbsp;:
                        <span style={{ color: 'black' }}>
                          {bill.store ? ` ${bill.store.owner}` : ' 익명'}
                        </span>
                        <br />
                        구&nbsp;매&nbsp;처&nbsp;명&nbsp;:{' '}
                        <span style={{ color: 'black' }}>
                          {bill.store ? bill.store.name : '익명'}
                        </span>
                        <br />
                        <span>
                          사업자번호 :{' '}
                          <span style={{ color: 'black' }}>
                            {bill.store
                              ? convertNumber(bill.store.businessNumber)
                              : '익명'}
                          </span>
                        </span>
                      </Typography>
                      <br />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginLeft: '3px' }}
                      >
                        판&nbsp;&nbsp; 매&nbsp;&nbsp;일&nbsp;&nbsp;시 :{' '}
                        <span style={{ color: 'black' }}>
                          {`${year}년 ${month}월 ${day}일 `}
                        </span>
                        <span style={{ fontSize: '10px' }}>
                          {updated ? '(수정됨)' : ''}
                        </span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginLeft: '3px', height: '52px' }}
                      >
                        <span>
                          메모:{' '}
                          <span style={{ color: 'black' }}>{bill.memo}</span>
                        </span>
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div
                style={{
                  height: '333px',
                  overflow: 'auto',
                }}
              >
                <TableContainer sx={{ width: '90%', marginLeft: '30px' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: 'lightgray', opacity: '0.6' }}
                      >
                        <TableCell width={'20%'} sx={{ fontSize: '13px' }}>
                          상품명
                        </TableCell>
                        <TableCell width={'20%'} sx={{ fontSize: '13px' }}>
                          판매가
                        </TableCell>
                        <TableCell width={'20%'} sx={{ fontSize: '13px' }}>
                          카테고리
                        </TableCell>
                        <TableCell width={'10%'} sx={{ fontSize: '12px' }}>
                          품절
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderProducts != undefined &&
                        orderProducts.map((item) => (
                          <TableRow
                            key={item.id}
                            sx={{
                              '& th': { fontSize: '13px' },
                            }}
                          >
                            <TableCell component="th">
                              {item.product.name}
                            </TableCell>
                            <TableCell>{item.product.price} 원</TableCell>
                            <TableCell>{item.product.categoryId}</TableCell>
                            <TableCell align="center">X</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DetailBillPage;
