import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import styles from './OrderProductBox.module.scss';
import { Product } from 'main/product/entities/product.entity';
import { orderProductsState } from 'renderer/recoil/states';
import { useRecoilState } from 'recoil';
import { useState, useEffect } from 'react';



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
            count: Number(value),
            orderPrice: orderProduct.product.price * Number(value),
          };
        }

        return item;
      })
    );
  };

  const updateOrderProduct = (product: Product, name: string) => {
    setOrderProducts(
      orderProducts.map((orderProduct) => {
        if (orderProduct.product.id === product.id) {
          if (name === 'INCREASE') {
            return {
              ...orderProduct,
              count: orderProduct.count + 1,
              orderPrice: orderProduct.orderPrice + product.price,
            };
          } else if (name === 'DECREASE') {
            if (count > 0) {
              return {
                ...orderProduct,
                count: orderProduct.count - 1,
                orderPrice: orderProduct.orderPrice - product.price,
              };
            }
          }
        }
        return orderProduct;
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
      <div className={styles.contents}>
        <div style={{ width: '7%', position: 'relative', marginRight: '15px', marginTop: '-10px' }}>
          <button className={styles.deleteButton} onClick={onDeleteClick}>
            x
          </button>
        </div>
        <div style={{ width: '40%', marginTop: '3px' }}>
          {orderProduct.product.name}
        </div>
        <div style={{ marginTop: '3px', width: '30%' }}>
          <span className={styles.cutText}>
            {orderProduct.orderPrice.toLocaleString('ko-KR')}원
          </span>
        </div>
        <div className={styles.count} style={{ width: '30%' }}>
          <span
            className={styles.decrease}
            onClick={() => updateOrderProduct(orderProduct.product, 'DECREASE')}
          >
            -
          </span>
          <input
            type="number"
            value={count}
            onChange={onCountChange}
            className={styles.count_input}
          />
          <span
            className={styles.increase}
            onClick={() => updateOrderProduct(orderProduct.product, 'INCREASE')}
          >
            +
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderProductBox;
