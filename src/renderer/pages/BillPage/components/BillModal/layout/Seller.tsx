import { useRecoilValue } from 'recoil';
import styles from '../BillModal.module.scss'
import { businessState } from 'renderer/recoil/states';
const Seller = () => {
  const business = useRecoilValue(businessState);

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
        <td colSpan={3} align="center">
          {business.businessNumber.toString().slice(0, 3)}-
          {business.businessNumber.toString().slice(3, 5)}-
          {business.businessNumber.toString().slice(5, 10)}
        </td>
      </tr>
      <tr>
        <th>상호</th>
        <td style={{ width: '25%', fontSize: '15px' }} align="center">
          {business?.name}
        </td>
        <th style={{ width: '14%' }}>성명</th>
        <td style={{ width: '20%', fontSize: '15px' }} align="center">
          {business.businessOwnerName}
        </td>
      </tr>
      <tr>
        <th>
          사업자
          <br />
          소재지
        </th>
        <td colSpan={3} style={{ fontSize: '15px', textAlign: 'center' }}>
          {business.address}
        </td>
      </tr>
      <tr>
        <th>업태</th>
        <td align="center" style={{ fontSize: '15px' }}>
          {business.typeofBusiness}
        </td>
        <th>업종</th>
        <td align="center" style={{ fontSize: '16px' }}>
          {business.sector}
        </td>
      </tr>
    </tbody>
  );
};

export default Seller;
