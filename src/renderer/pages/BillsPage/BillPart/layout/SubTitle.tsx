import { Bill } from 'main/bill/entities/bill.entity';
import styles from '../BillPartPage.module.scss'

type IProps = {
  bill: Bill;
}

const SubTitle = ({ bill} : IProps) => {
  return (
    <table
      style={{ width: '100%', border: '0', marginTop: '20px' }}
      cellPadding="0"
      cellSpacing="0"
      className={styles.ownerData}
    >
      <tbody>
        <tr>
          <td style={{ width: '45%' }}>
            <span style={{ fontSize: '10px', fontWeight: '400' }}>
              {' '}
              (공급받는자용)
            </span>
          </td>
          <td className={styles.name}>
            {bill.store ? bill.store.owner : '익명'} 님
          </td>
          <td className={styles.for}>&ensp;귀하</td>
        </tr>
      </tbody>
    </table>
  );
};

export default SubTitle;
