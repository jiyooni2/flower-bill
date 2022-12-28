import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { storeState, productsState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import styles from './BillPage.module.scss';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import StoreSearchModal from '../../components/StoreSearchModal/StoreSearchModal';
import { CreateOrderProductInput } from 'main/orderProduct/dtos/create-orderProduct.dto';

const BillPage = () => {
  const [orderProductInputs, setOrderProductInputs] = useState<
    CreateOrderProductInput[]
  >([]);
  const [products, setProducts] = useRecoilState(productsState);
  const [memo, setMemo] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const store = useRecoilValue(storeState);

  const createBill = () => {
    window.electron.ipcRenderer.sendMessage('create-bill', {
      orderProductIds: [1, 2, 3],
      memo: '하이',
    });
  };

  const onProductClick = (
    event: React.MouseEvent<HTMLDivElement>,
    product: Product
  ) => {
    setOrderProductInputs((prev) => [
      ...prev,
      {
        productId: product.id as number,
        count: 1,
        orderPrice: product.price,
      },
    ]);

    const onUpdateProductClick = (
      event: React.MouseEvent<HTMLDivElement>,
      product: Product
    ) => {
      setOrderProductInputs(
        orderProductInputs.map((orderProduct) => {
          if (orderProduct.productId === product.id) {
            return {
              ...orderProduct,
              count: orderProduct.count + 1,
              orderPrice: orderProduct.orderPrice + product.price,
            };
          }
          return orderProduct;
        })
      );
    };
  };

  return (
    <>
      <StoreSearchModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.container}>
        <div className={`${styles.content_container} ${styles.bill_container}`}>
          <h1>계산서</h1>
          <hr />
          <div>
            {store.name !== '' ? store.name : '______'}
            귀하
            <Button onClick={() => setIsOpen(true)}>스토어 검색</Button>
          </div>
          <div>
            {orderProductInputs.map((product) => (
              <div key={product.productId}>
                {product.count}개 {product.orderPrice.toLocaleString('ko-KR')}
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${styles.content_container} ${styles.products_container}`}
        >
          <h1>상품</h1>
          <hr />
          <div className={styles.products_list}>
            {products.map((product) => (
              <div
                key={product.id}
                className={styles.product_box}
                onClick={(event) => onProductClick(event, product)}
              >
                <div>{product.name}</div>
                <div>{product.price.toLocaleString('ko-KR')}원</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BillPage;
