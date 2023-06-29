import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  productsState,
  orderProductsState,
  tokenState,
  businessState,
} from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
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
import DiscountModal from 'renderer/pages/BillPage/components/DiscountModal/DiscountModal';
import MemoModal from './components/MemoModal/MemoModal';
import Buttons from './Buttons';
import UpdateBillSum from './UpdateBillSum';
import styles from './UpdateBillPage.module.scss'

const UpdateBillPage = () => {
  const setProducts = useSetRecoilState(productsState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const orderProducts = useRecoilValue(orderProductsState);
  const [isSearchStoreOpen, setIsSearchStoreOpen] = useState<boolean>(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(false);
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);
  const [isBillOpen, setIsBillOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);


  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', {
      token,
      businessId: business.id,
    });
    const getProductsRemover = window.electron.ipcRenderer.on(
      'get-products',
      (args: GetProductsOutput) => {
        setProducts(args.products as Product[]);
        getProductsRemover();
      }
    );
  }, []);

  const handlePage = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  let LAST_PAGE = 1;
  if (orderProducts != undefined) {
    LAST_PAGE = orderProducts.length % 4 === 0
      ? Math.round(orderProducts.length / 4)
      : Math.floor(orderProducts.length / 4) + 1;
  } else if (orderProducts == null) {
    LAST_PAGE = 1;
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
          <UpdateBillSum orderProducts={orderProducts} />
          <Buttons
            setIsDiscountOpen={setIsDiscountOpen}
            setIsMemoOpen={setIsMemoOpen}
            setIsSearchStoreOpen={setIsSearchStoreOpen}
            setIsBillOpen={setIsBillOpen}
          />
        </div>
        <ProductsGrid />
      </div>
    </>
  );
};

export default UpdateBillPage;
