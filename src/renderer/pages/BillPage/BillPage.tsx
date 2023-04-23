import Button from '@mui/material/Button';
import { ChangeEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  orderProductsState,
  businessState,
} from 'renderer/recoil/states';
import styles from './BillPage.module.scss';
import StoreSearchModal from './components/StoreSearchModal/StoreSearchModal';
import OrderProductBox from './components/OrderProductBox/OrderProductBox';
import { Pagination, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import ProductsGrid from './components/ProductsGrid/ProductsGrid';
import BillModal from './components/BillModal/BillModal';
import DiscountModal from './components/DiscountModal/DiscountModal';
import MemoModal from './components/MemoModal/MemoModal';
import BillSum from './layout/BillSum';
import Buttons from './layout/Buttons';

const BillPage = () => {
  const business = useRecoilValue(businessState)
  const orderProducts = useRecoilValue(orderProductsState);
  const [isSearchStoreOpen, setIsSearchStoreOpen] = useState<boolean>(false);
  const [isBillOpen, setIsBillOpen] = useState<boolean>(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(false);
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);


  const handlePage = (event:ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  let LAST_PAGE;
  if (orderProducts == null) {
    LAST_PAGE = 1;
  } else if (orderProducts != undefined || orderProducts) {
    LAST_PAGE =
      orderProducts?.length % 4 === 0
        ? Math.round(orderProducts?.length / 4)
        : Math.floor(orderProducts?.length / 4) + 1;
  }

  return (
    <>
      <MemoModal
        isOpen={isMemoOpen}
        setIsOpen={setIsMemoOpen}
        key={business.id}
      />
      <StoreSearchModal
        isOpen={isSearchStoreOpen}
        setIsOpen={setIsSearchStoreOpen}
      />
      <BillModal isOpen={isBillOpen} setIsOpen={setIsBillOpen} />
      <DiscountModal isOpen={isDiscountOpen} setIsOpen={setIsDiscountOpen} />
      <div className={styles.container}>
        <div className={styles.content_container} style={{ width: '50%' }}>
          <Typography
            variant="h6"
            fontWeight={600}
            align="center"
            marginTop="15px"
            marginBottom="7px"
            fontSize={'24px'}
          >
            계산서
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ fontWeight: 'bold' }}>
                <TableCell sx={{ width: '10%' }}></TableCell>
                <TableCell sx={{ width: '24%' }}>상품</TableCell>
                <TableCell sx={{ width: '22%' }}>총 금액</TableCell>
                <TableCell sx={{ width: '25%' }}>개수</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.orderProducts_list}>
              {orderProducts
                .slice((page - 1) * 4, page * 4)
                .map((orderProduct) => (
                  <OrderProductBox
                    key={orderProduct.id ? orderProduct.id : Math.random()}
                    orderProduct={orderProduct}
                  />
                ))}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '50%',
            }}
          >
            <Pagination
              count={LAST_PAGE}
              size="small"
              color="standard"
              onChange={handlePage}
            />
          </div>
          <div
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: '15px',
            }}
          >
            <BillSum orderProducts={orderProducts} />
            <Buttons setIsDiscountOpen={setIsDiscountOpen} setIsMemoOpen={setIsMemoOpen} setIsSearchStoreOpen={setIsSearchStoreOpen} setIsBillOpen={setIsBillOpen} />
          </div>
        </div>
        <ProductsGrid />
      </div>
    </>
  );
};

export default BillPage;
