import { OrderProduct } from "main/orderProduct/entities/orderProduct.entity";
import styles from '../BillPartPage.module.scss'

type IProps = {
  orderProducts: OrderProduct[]
}

const Ordered = ({ orderProducts }: IProps) => {
  return (
    <>
      <tbody>
        <tr>
          <th>품목</th>
          <th>수량</th>
          <th>단가</th>
          <th>금액</th>
        </tr>
      </tbody>
      {orderProducts != undefined &&
        orderProducts?.map((orderProduct) => {
          return (
            <tbody key={orderProduct.productId}>
              <tr>
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
            </tbody>
          );
        })}
    </>
  );
};

export default Ordered;
