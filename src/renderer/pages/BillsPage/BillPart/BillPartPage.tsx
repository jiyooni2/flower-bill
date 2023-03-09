import { useEffect } from 'react';
import styles from './BillPartPage.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { billState, businessState, productsState, tokenState} from 'renderer/recoil/states';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { Product } from 'main/product/entities/product.entity';
import { Paper } from '@mui/material';

const BillPartPage = () => {
  const token = useRecoilValue(tokenState)
  const business = useRecoilValue(businessState)
  const bill = useRecoilValue(billState);

  let sum = 0;
  bill.orderProducts.map((items) => {
    sum += items.orderPrice * items.count;
  });
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <>
      <Paper style={{ width: '100%', height: '103%', padding: '9px', marginLeft: '10px' }}>
        <div style={{ height: '500px', marginTop: '15px' }}>
          <table
            style={{ width: '100%', border: '0' }}
            cellPadding="0"
            cellSpacing="0"
            className="title"
          >
            <tbody>
              <tr>
                <td align="center">
                  <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
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
                  <span style={{ fontSize: '10px', fontWeight: '400' }}>
                    {' '}
                    (공급받는자용)
                  </span>
                </td>
                <td className={styles.name}>{bill.store.owner} 님</td>
                <td className={styles.for}>&ensp;귀하</td>
              </tr>
            </tbody>
          </table>
          <table
            style={{ width: '100%' }}
            cellPadding="0"
            cellSpacing="0"
            className={styles.tbl}
          >
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
                    {bill.business.businessNumber}
                  </span>
                </td>
              </tr>
              <tr>
                <th>상호</th>
                <td style={{ width: '25%', fontSize: '15px' }} align="center">
                  {bill.store.name}
                </td>
                <th style={{ width: '14%' }}>성명</th>
                <td style={{ width: '20%', fontSize: '15px' }} align="center">
                  {bill.store.owner}
                </td>
              </tr>
              <tr>
                <th>
                  사업자
                  <br />
                  소재지
                </th>
                <td
                  colSpan={3}
                  style={{ fontSize: '15px', textAlign: 'center' }}
                >
                  {bill.store.address}
                </td>
              </tr>
              <tr>
                <th>업태</th>
                <td align="center">{/* 업태 */}</td>
                <th>종목</th>
                <td align="center">{/* 업종 */}</td>
              </tr>
            </tbody>
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
                <th>공급대가총액</th>
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
            width="100%"
            cellSpacing="0"
            cellPadding="0"
            className={styles.tbl}
          >
            <tbody>
              <tr>
                <th>월일</th>
                <th>품목</th>
                <th>수량</th>
                <th>단가</th>
                <th>금액</th>
              </tr>
            </tbody>
            {bill.orderProducts.map((orderProduct) => {
              console.log(orderProduct);
              return (
                <tbody key={orderProduct.productId}>
                  <tr>
                    <td className={styles.item}>{`${month} / ${day}`}</td>
                    <td className={styles.item}>{}</td>
                    <td className={styles.article}>{}</td>
                    <td className={styles.price}>{}</td>
                    <td className={styles.sum}>{}</td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <div className={styles.sumDiv}>
            <td className={styles.lastSum}>합&ensp;&ensp;계</td>
            <td style={{ float: 'right', marginRight: '10px', color: 'black' }}>
              ₩ {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </td>
          </div>
        </div>
      </Paper>
    </>
  );
};
export default BillPartPage;
