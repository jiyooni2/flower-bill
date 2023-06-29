import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import styles from '../BillPartPage.module.scss';
import Ordered from './Ordered';

type IProps = {
  orderProducts: OrderProduct[];
  sum: number;
};

const Pay = ({ orderProducts, sum }: IProps) => {
  return (
    <>
      <table
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '5px',
          paddingBottom: '5px',
          border: '1px solid black',
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
              }}
            >
              공&ensp;&ensp;급&ensp;&ensp;내&ensp;&ensp;역
            </td>
          </tr>
        </tbody>
      </table>
      <table
        width="100%"
        cellSpacing="0"
        cellPadding="0"
        className={styles.tbl}
      >
        <Ordered orderProducts={orderProducts} />
      </table>
      <table style={{ width: '100%'}}>
        <tbody>
          <tr
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className={styles.sumDiv}
          >
            <td className={styles.lastSum}>합&ensp;&ensp;계</td>
            <td
              style={{
                float: 'right',
                marginRight: '10px',
                color: 'black',
              }}
            >
              ₩ {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Pay;
