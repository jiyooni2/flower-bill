import styles from './BillPartPage.module.scss';
import { useRecoilValue } from 'recoil';
import { billState, businessState, tokenState } from 'renderer/recoil/states';
import { Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { BillResult } from 'main/common/dtos/bill-result.dto';
import { GetBillOutput } from 'main/bill/dtos/get-bill.dto';

const BillPartPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState)
  const bill = useRecoilValue(billState);
  const [currentBill, setCurrentBill] = useState<BillResult>({
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderProducts: [],
    store: null,
    business: null,
    businessId: 0,
  });

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-bill', {
      token,
      id: bill.id,
      businessId: business.id,
    });

    window.electron.ipcRenderer.on(
      'get-bill',
      ({ ok, error, bill }: GetBillOutput) => {
        if (ok) {
          setCurrentBill(bill);
        } else {
          console.error(error);
        }
      }
    );
  }, []);

  let sum = 0;
  currentBill.orderProducts.map((items) => {
    sum += items.orderPrice * items.count;
  });
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <>
      <Paper
        style={{
          width: '7cm',
          height: '103%',
          padding: '15px',
          marginLeft: '10px',
        }}
      >
        <div style={{ width: '6.2cm', height: '490px', marginTop: '35px' }}>
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
                    {bill.business.businessNumber.toString().slice(0, 3)}-
                    {bill.business.businessNumber.toString().slice(3, 5)}-
                    {bill.business.businessNumber.toString().slice(5, 10)}
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
            {currentBill.orderProducts.map((orderProduct) => {
              return (
                <tbody key={orderProduct.productId}>
                  <tr>
                    <td className={styles.item}>{`${month} / ${day}`}</td>
                    <td className={styles.item}>{orderProduct.product.name}</td>
                    <td className={styles.article}>{orderProduct.count}</td>
                    <td className={styles.price}>
                      {orderProduct.product.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                    <td className={styles.sum}>
                      {orderProduct.orderPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <table style={{ width: '100%' }}>
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
        </div>
      </Paper>
    </>
  );
};
export default BillPartPage;
