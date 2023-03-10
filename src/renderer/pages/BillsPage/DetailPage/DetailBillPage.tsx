import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import BillPartPage from '../BillPart/BillPartPage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { billState, businessState, categoriesState, tokenState } from 'renderer/recoil/states';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { Category } from 'main/category/entities/category.entity';

const DetailBillPage = () => {
  const bill = useRecoilValue(billState);
  const token = useRecoilValue(tokenState)
  const business = useRecoilValue(businessState)
  const [categories, setCategories] = useRecoilState(categoriesState)

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-categories',
      (args: GetCategoriesOutput) => {
        setCategories(args.categories as Category[]);
      }
    );
  }, [])

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
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0px' }}>
          <div style={{ width: '11cm', margin: '1%' }}>
            <BillPartPage />
          </div>
          <div style={{ width: '100%' }}>
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
                    marginLeft: '20px',
                    marginRight: '0px',
                  }}
                >
                  <Card
                    sx={{
                      width: '95%',
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
                          {bill.createdAt &&
                            `${bill.createdAt.getFullYear()}년 ${bill.createdAt.getMonth()}월 ${bill.createdAt.getDate()}일 `}
                          {bill.createdAt &&
                            `${bill.createdAt.getHours()}시 ${bill.createdAt.getMinutes()}분 ${bill.createdAt.getSeconds()}초`}
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
                  height: '320px',
                  width: '100%',
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
                      {bill.orderProducts.map((item) => (
                        <TableRow
                          key={item.productId}
                          sx={{
                            '& th': { fontSize: '13px' },
                          }}
                        >
                          <TableCell component="th">
                            {item.product.name}
                          </TableCell>
                          <TableCell>
                            {item.product.price} 원
                          </TableCell>
                          <TableCell>
                            {item.product.categoryId}
                          </TableCell>
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
