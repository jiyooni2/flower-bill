import { useRecoilValue } from 'recoil';
import styles from '../BillModal.module.scss'
import Ordered from './Ordered';
import { orderProductsState, storeState } from 'renderer/recoil/states';
import Seller from './Seller';

type BillProps = {
  printRef: React.MutableRefObject<undefined>
}

const Bill = ({ printRef } :BillProps ) => {
  const orderProducts = useRecoilValue(orderProductsState);
  const store = useRecoilValue(storeState);

  let sum = 0;
  orderProducts?.map((items) => {
    sum += items.orderPrice * items.count;
  });
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <div
      ref={printRef}
      style={{ height: '97%', overflow: 'auto', marginBottom: '12px' }}
    >
      <table
        style={{ width: '100%', border: '0' }}
        cellPadding="0"
        cellSpacing="0"
        className={styles.title}
      >
        <tbody>
          <tr>
            <td align="center">
              <span style={{ fontSize: '25px', fontWeight: 'bold' }}>
                영&ensp;수&ensp;증
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        style={{ width: '100%', border: '0', marginTop: '20px' }}
        cellPadding="0"
        cellSpacing="0"
        className={styles.ownerData}
      >
        <tbody>
          <tr>
            <td style={{ width: '45%' }}>
              <span style={{ fontSize: '15px', fontWeight: '400' }}>No.</span>
            </td>
            <td className={styles.name}>{store ? store.owner : '(익명)'} 님</td>
            <td className={styles.for}>&ensp;귀하</td>
          </tr>
        </tbody>
      </table>
      <table
        style={{ width: '100%', textAlign: 'center' }}
        cellPadding="0"
        cellSpacing="0"
        className={styles.body}
      >
        <Seller />
      </table>
      <table
        width="100%"
        cellSpacing="0"
        cellPadding="0"
        className={styles.body}
      >
        <tbody>
          <tr>
            <th>작성일</th>
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
        className={styles.body}
      >
        <Ordered orderProducts={orderProducts} />
      </table>
      <table className={styles.sumDiv}>
        <tbody
          style={{
            width: '100%',
          }}
        >
          <tr style={{ display: 'flex', justifyContent: 'space-between' }}>
            <td className={styles.lastSum}>합&ensp;&ensp;계</td>
            <td
              style={{
                marginRight: '10px',
                color: 'black',
              }}
            >
              ₩ {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Bill;
