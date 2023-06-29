import styles from './BillPartPage.module.scss';
import { Paper } from '@mui/material';
import { Bill } from 'main/bill/entities/bill.entity';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import Seller from './layout/Seller';
import Pay from './layout/Pay';
import Title from './layout/Title';
import SubTitle from './layout/SubTitle';

interface IProps {
  bill: Bill;
  orderProducts: OrderProduct[];
}

const BillPartPage = ({bill, orderProducts}: IProps) => {

  let sum = 0;
  orderProducts != undefined &&
    orderProducts?.map((items) => {
      sum += items.orderPrice * items.count;
    });
  const date = new Date(bill.updatedAt ? bill.updatedAt : bill.createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <>
      <Paper
        style={{
          width: '7cm',
          height: '88%',
          padding: '15px',
          marginLeft: '10px',
          marginBottom: '20px',
          overflow: 'auto'
        }}
      >
        <div style={{ width: '6.2cm', height: '490px', marginTop: '35px'}}>
          <Title />
          <SubTitle bill={bill} />
          <table
            style={{ width: '100%' }}
            cellPadding="0"
            cellSpacing="0"
            className={styles.tbl}
          >
            <Seller bill={bill} />
          </table>
          <table
            width="100%"
            cellSpacing="0"
            cellPadding="0"
            className={styles.tbl}
          >
            <tbody>
              <tr>
                <th>작성년월일</th>
                <th>공급가 총액</th>
                <th>비고</th>
              </tr>
              <tr>
                <td className={styles.date}>{`${year} . ${month} . ${day}`}</td>
                <td className={styles.total}>
                  <span style={{ fontWeight: 'bold' }}>₩</span>{' '}
                  {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </td>
                <td> </td>
              </tr>
            </tbody>
          </table>
          <Pay orderProducts={orderProducts} sum={sum} />
        </div>
      </Paper>
    </>
  );
};
export default BillPartPage;
