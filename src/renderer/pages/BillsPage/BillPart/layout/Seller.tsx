import styles from '../BillPartPage.module.scss';
import { Bill } from 'main/bill/entities/bill.entity';

type IProps = {
  bill: Bill;
}

const Seller = ({ bill } : IProps) => {
  return (
    <tbody>
      <tr>
        <td
          style={{ width: '8%' }}
          rowSpan={5}
          align="center"
          className={styles.owner}
        >
          공 급 자
        </td>
        <th style={{ width: '22%' }}>
          사업자
          <br />
          등록번호
        </th>
        <td colSpan={3}>
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            {bill.business.businessNumber.toString().slice(0, 3)}-
            {bill.business.businessNumber.toString().slice(3, 5)}-
            {bill.business.businessNumber.toString().slice(5, 10)}
          </span>
        </td>
      </tr>
      <tr>
        <th>상호</th>
        <td style={{ width: '25%', fontSize: '15px' }} align="center">
          {bill.business?.name}
        </td>
        <th style={{ width: '14%' }}>성명</th>
        <td style={{ width: '20%', fontSize: '15px' }} align="center">
          {bill.business.businessOwnerName}
        </td>
      </tr>
      <tr>
        <th>
          사업자
          <br />
          소재지
        </th>
        <td colSpan={3} style={{ fontSize: '15px', textAlign: 'center' }}>
          {bill.business.address}
        </td>
      </tr>
      <tr>
        <th>업태</th>
        <td align="center">{bill.business.typeofBusiness}</td>
        <th>종목</th>
        <td align="center">{bill.business.sector}</td>
      </tr>
    </tbody>
  );
};

export default Seller;
