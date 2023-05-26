import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import useAddComma from 'renderer/hooks/useAddComma';
import styles from '../BillPage.module.scss';

type IProps = {
  orderProducts: OrderProduct[];
};

const BillSum = ({ orderProducts }: IProps) => {
  const addComma = useAddComma();

  let sum = 0;
  orderProducts?.map((items) => {
    sum += items.orderPrice * items.count;
  });

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.total}>
        <p className={styles.totalName}>과세&nbsp;물품</p>
        <h6 className={styles.totalNum}>
          {addComma(Math.round(sum / 1.1).toString())} 원
        </h6>
      </div>
      <hr />
      <div className={styles.total}>
        <p className={styles.totalName}>부&nbsp;&nbsp;가&nbsp;&nbsp;세</p>
        <h6 className={styles.totalNum}>
          {addComma(Math.round(Math.round(sum / 1.1) * 0.1).toString())} 원
        </h6>
      </div>
      <hr />
      <div className={styles.total}>
        <p className={styles.totalName}>
          할&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;인
        </p>
        <p className={styles.totalNum}>0 원</p>
      </div>
      <hr />
      <div className={styles.total}>
        <p className={styles.totalName}>
          합&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;계
        </p>
        <p className={styles.totalNum}>{addComma(sum.toString())} 원</p>
      </div>
      <hr />
    </div>
  );
};

export default BillSum;
