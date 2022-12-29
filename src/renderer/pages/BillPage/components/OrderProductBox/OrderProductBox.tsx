import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import styles from './OrderProductBox.module.scss';
import { orderProductsState } from 'renderer/recoil/states';
import { useRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

interface IProps {
  orderProduct: OrderProduct;
}

const OrderProductBox = ({ orderProduct }: IProps) => {
  const [count, setCount] = useState<number>(orderProduct.count);
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);

  const onCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (Number(value) < 0) return;

    setCount(Number(value));
    setOrderProducts(
      orderProducts.map((item) => {
        if (item.product.id === orderProduct.product.id) {
          return {
            ...item,
            count,
            orderPrice: orderProduct.product.price * Number(value),
          };
        }

        return item;
      })
    );
  };

  const onDeleteClick = () => {
    setOrderProducts(
      orderProducts.filter(
        (item) => item.product.id !== orderProduct.product.id
      )
    );
  };

  useEffect(() => {
    setCount(orderProduct.count);
  }, [orderProduct.count]);

  return (
    <div className={styles.container}>
      <div>
        <div>{orderProduct.product.name}</div>
        <div>{orderProduct.orderPrice.toLocaleString('ko-KR')}원</div>
      </div>
      <div>
        <input
          type="number"
          value={count}
          onChange={onCountChange}
          className={styles.count_input}
        />
        <Button onClick={onDeleteClick}>X</Button>
      </div>
    </div>
  );
};

export default OrderProductBox;
