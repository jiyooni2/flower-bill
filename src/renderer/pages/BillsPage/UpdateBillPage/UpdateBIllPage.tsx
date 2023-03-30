import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  productsState,
  orderProductsState,
  tokenState,
  businessState,
  storeState,
  billState,
} from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import styles from './UpdateBillPage.module.scss';
import StoreSearchModal from './components/StoreSearchModal/StoreSearchModal';
import OrderProductBox from './components/OrderProductBox/OrderProductBox';
import {
  Pagination,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ProductsGrid from './components/ProductsGrid/ProductsGrid';
import BillModal from './components/BillModal/BillModal';
import { BillResult } from 'main/common/dtos/bill-result.dto';
import { GetBillOutput } from 'main/bill/dtos/get-bill.dto';
import DiscountModal from 'renderer/pages/BillPage/components/DiscountModal/DiscountModal';

const UpdateBillPage = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);
  const [isSearchStoreOpen, setIsSearchStoreOpen] = useState<boolean>(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(false);
  const [isBillOpen, setIsBillOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [bill, setBill] = useRecoilState(billState);
  const [currentBill, setCurrentBill] = useState<BillResult>();


  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-products',
      (args: GetProductsOutput) => {
        setProducts(args.products as Product[]);
      }
    );
  }, []);

  const handlePage = (event: any) => {
    const pageNow = parseInt(event.target.outerText);
    setPage(pageNow);
  };

  let sum = 0;
  orderProducts.map((items) => {
    sum += items.orderPrice * items.count;
  });

  const discount = 0;

  const LAST_PAGE =
    orderProducts.length % 4 === 0
      ? Math.round(orderProducts.length / 4)
      : Math.floor(orderProducts.length / 4) + 1;

  const addComma = (data: number) => {
    return `${data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const billClickHandler = () => {
    setIsBillOpen(true);
  };

  console.log(currentBill)

  return (
    <>
      <StoreSearchModal
        isOpen={isSearchStoreOpen}
        setIsOpen={setIsSearchStoreOpen}
      />
      <BillModal isOpen={isBillOpen} setIsOpen={setIsBillOpen} />
      <DiscountModal isOpen={isDiscountOpen} setIsOpen={setIsDiscountOpen} />
      <div className={styles.container}>
        <div
          className={`${styles.content_container} ${styles.bill_container}`}
          style={{ width: '50%' }}
        >
          <Typography
            variant="h5"
            align="center"
            marginTop="15px"
            marginBottom="7px"
          >
            계산서
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ fontWeight: 'bold' }}>
                <TableCell sx={{ width: '10%' }}></TableCell>
                <TableCell sx={{ width: '34%' }}>상품</TableCell>
                <TableCell sx={{ width: '32%' }}>총 금액</TableCell>
                <TableCell sx={{ width: '30%' }}>개수</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.orderProducts_list}>
              {orderProducts
                .slice((page - 1) * 4, page * 4)
                .map((orderProduct) => (
                  <OrderProductBox
                    key={orderProduct.product.id}
                    orderProduct={orderProduct}
                  />
                ))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100px',
              }}
            >
              <Pagination
                count={LAST_PAGE}
                size="small"
                color="standard"
                defaultPage={1}
                boundaryCount={1}
                onChange={handlePage}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            marginLeft: '20px',
            marginRight: '10px',
            position: 'absolute',
            bottom: '30px',
            width: '30%',
          }}
        >
          <div>
            <div className={styles.total}>
              <p className={styles.totalName}>과세&nbsp;물품</p>
              <h6 className={styles.totalNum}>
                {addComma(Math.round(sum / 1.1))} 원
              </h6>
            </div>
            <hr />
            <div className={styles.total}>
              <p className={styles.totalName}>부&nbsp;&nbsp;가&nbsp;&nbsp;세</p>
              <h6 className={styles.totalNum}>
                {addComma(Math.round(Math.round(sum / 1.1) * 0.1))} 원
              </h6>
            </div>
            <hr />
            <div className={styles.total}>
              <p className={styles.totalName}>
                합&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;계
              </p>
              <p className={styles.totalNum}>
                {addComma(sum - (sum * discount) / 100)} 원
              </p>
            </div>
            <hr />
          </div>
          <div
            style={{
              marginTop: '15px',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              gap: '10px',
            }}
          >
            <Button
              variant="contained"
              // color="secondary"
              sx={{
                height: '33px',
                width: '100%',
                backgroundColor: 'ghostwhite',
                opacity: '0.9',
                marginleft: '20px',
                color: '#228af2',
                '&:hover': {
                  color: 'lightskyblue',
                },
              }}
              onClick={() => setIsSearchStoreOpen(true)}
            >
              판매처 선택하기
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsDiscountOpen(true)}
              sx={{
                height: '33px',
                width: '100%',
                backgroundColor: 'ghostwhite',
                color: 'blueviolet',
                '&:hover': {
                  color: 'lightskyblue',
                },
              }}
            >
              판매가 수정하기
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={billClickHandler}
              sx={{
                height: '33px',
                width: '100%',
                marginTop: '10px',
                backgroundColor: '#228bf2',
                color: '#e8f8e2',
              }}
            >
              계산서 생성
            </Button>
          </div>
        </div>
        <ProductsGrid />
      </div>
    </>
  );
};

export default UpdateBillPage;
