// import { Bill } from 'main/bill/entities/bill.entity';
import styles from './DetailBillPage.module.scss';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import BillPartPage from '../BillPart/BillPartPage';
import { useRecoilValue } from 'recoil';
import { billState } from 'renderer/recoil/states';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { BrowserWindow } from 'electron';
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
          marginTop: '-10px'
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
        <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
          <div style={{ width: '7cm', margin: '5px' }}>
            <BillPartPage />
          </div>
          <div style={{ width: '61%' }}>
            <div style={{ margin: '5px', height: '90%' }}>
              <div>
                <Typography
                  variant="h6"
                  fontSize={'27px'}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  판매자 정보
                </Typography>
                <div>
                  <p>
                    <span>판매처 : {bill.business.name}</span>
                  </p>
                  <p>
                    <span>사업자 번호 : {bill.business.businessNumber}</span>
                    <span>판매처 주소 : {bill.business.address}</span>
                  </p>
                </div>
              </div>
              <div>
                {/* <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
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
                          <TableCell component="th" scope="row">
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DetailBillPage;
