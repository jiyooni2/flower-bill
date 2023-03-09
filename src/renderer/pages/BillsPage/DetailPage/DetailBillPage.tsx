// import { Bill } from 'main/bill/entities/bill.entity';
import styles from './DetailBillPage.module.scss';
import { Button, Card, CardActionArea, CardContent, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import BillPartPage from '../BillPart/BillPartPage';
import { useRecoilValue } from 'recoil';
import { billState } from 'renderer/recoil/states';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link } from 'react-router-dom';
// import RealBillPage from './RealBillPage/RealBillPage';

const DetailBillPage = () => {
  const bill = useRecoilValue(billState);

  return (
    <>
      <div
        style={{
          justifyContent: 'none',
          width: '100%',
          height: '100%',
          marginTop: '-10px',
        }}
      >
        <div>
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
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <div style={{ width: '7cm', margin: '1%' }}>
            <BillPartPage />
          </div>
          <div style={{ width: '57%' }}>
            <div
              style={{
                height: '100px',
                marginTop: '10px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginLeft: '25px',
                  }}
                >
                  <Card
                    sx={{
                      width: '400px',
                      backgroundColor: 'floralwhite',
                      height: '100%',
                      marginBottom: '15px',
                    }}
                  >
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: '500' }}
                      >
                        {bill.business.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginLeft: '3px' }}
                      >
                        <span>
                          사업자 번호 :{' '}
                          <span style={{ color: 'black' }}>
                            {bill.business.businessNumber}
                          </span>
                        </span>
                        <br />
                        <span>
                          판매처 주소 :{' '}
                          <span style={{ color: 'black' }}>
                            {bill.business.address}
                          </span>
                        </span>
                      </Typography>
                      <br />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginLeft: '3px' }}
                      >
                        판매일시 :{' '}
                        <span style={{ color: 'black' }}>
                          {bill.createdAt && (`${bill.createdAt.getFullYear()}년 ${bill.createdAt.getMonth()}월 ${bill.createdAt.getDate()}일 `)}
                          {bill.createdAt && (`${bill.createdAt.getHours()}시 ${bill.createdAt.getMinutes()}분 ${bill.createdAt.getSeconds()}초`)}
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
              <div style={{ marginLeft: '45px', height: '325%', width: '400px' }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'lightgray', opacity: '0.6'}}>
                          <TableCell width={'25%'}>상품명</TableCell>
                          <TableCell width={'20%'}>판매가</TableCell>
                          <TableCell width={'20%'}>카테고리</TableCell>
                          <TableCell width={'10%'}>품절</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bill.orderProducts.map((item) => (
                          <TableRow
                            key={item.productId}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            {/* <TableCell component="th" scope="row">
                            {item.product.name}
                          </TableCell>
                          <TableCell align="right">
                            {item.product.price}
                          </TableCell>
                          <TableCell align="right">
                            {item.product.categoryId}
                          </TableCell>
                          <TableCell align="right">
                            품절 유무
                          </TableCell> */}
                            <TableCell>여기 데이터 들어감</TableCell>
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
