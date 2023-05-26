import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import styles from '../BillModal.module.scss';

type IProps = {
  orderProducts: OrderProduct[];
};

const Ordered = ({ orderProducts }: IProps) => {
  return (
    <>
      <tbody>
        <tr>
          <th>품목</th>
          <th style={{ width: '13%' }}>수량</th>
          <th>단가</th>
          <th>금액</th>
        </tr>
      </tbody>
      <tbody>
        {orderProducts.length > 5 &&
          orderProducts?.map((orderProduct) => {
            return (
              <tr key={orderProduct.id ? orderProduct.id : Math.random()}>
                <td className={styles.item}>{orderProduct.product?.name}</td>
                <td className={styles.article}>{orderProduct.count}</td>
                <td className={styles.price}>
                  {orderProduct.orderPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  원
                </td>
                <td className={styles.sum}>
                  {(orderProduct.orderPrice * orderProduct.count)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  원
                </td>
              </tr>
            );
          })}
        {orderProducts.length <= 5 &&
          orderProducts.map((orderProduct, i) => {
            return (
              <tr key={orderProduct.id ? orderProduct.id : Math.random()}>
                <td className={styles.item}>{orderProduct.product?.name}</td>
                <td className={styles.article}>{orderProduct.count}</td>
                <td className={styles.price}>
                  {orderProduct.orderPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  원
                </td>
                <td className={styles.sum}>
                  {(orderProduct.orderPrice * orderProduct.count)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  원
                </td>
              </tr>
            );
          })}
        {orderProducts.length <= 5 &&
          Array.from({ length: 5 - orderProducts.length }, (_, i) => i).map((el) => (
            <tr key={el}>
              <td className={styles.item} style={{ height: '20px' }}></td>
              <td className={styles.article}></td>
              <td className={styles.price}></td>
              <td className={styles.sum}></td>
            </tr>
          ))}
      </tbody>
    </>
  );
};

export default Ordered;
