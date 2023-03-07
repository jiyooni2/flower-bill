import styles from './BillModal.module.scss';
import { useRecoilValue } from 'recoil';
import {
  businessState,
  memoState,
  orderProductsState,
  storeState,
  tokenState,
} from 'renderer/recoil/states';
import Modal from './Modal';
import { useRef, useState } from 'react';
import {
  CreateBillInput,
  // CreateBillOutput,
} from 'main/bill/dtos/create-bill.dto';
import { GetBillOutput } from 'main/bill/dtos/get-bill.dto';
import { Button } from '@mui/material';
import MemoModal from '../MemoModal/MemoModal';
// import { Printer } from 'react-thermal-printer';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const orderProducts = useRecoilValue(orderProductsState);
  const memo = useRecoilValue(memoState);
  const store = useRecoilValue(storeState);
  const [memoIsOpen, setMemoIsOpen] = useState<boolean>(false);
  const printRef = useRef();

  const handleClick = async () => {
    setIsOpen(false);
    const orderProductInputs = orderProducts.map((orderProduct) => ({
      businessId: business.id,
      count: orderProduct.count,
      productId: orderProduct.product.id,
      orderPrice: orderProduct.orderPrice,
    }));

    const newBill: CreateBillInput = {
      businessId: business.id,
      token,
      storeId: store.id,
      memo,
      orderProductInputs,
    };

    window.electron.ipcRenderer.sendMessage('create-bill', {
      ...newBill,
    });
    window.electron.ipcRenderer.on(
      'create-bill',
      ({ ok, error, bill }: GetBillOutput) => {
        if (ok) {
          console.log(bill);
        } else if (error) {
          console.log(error);
        }
      }
    );
  };

  let sum = 0;
  orderProducts.map((items) => {
    sum += items.orderPrice * items.count;
  });
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <>
      <MemoModal
        isOpen={memoIsOpen}
        setIsOpen={setMemoIsOpen}
        key={business.id}
      />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div ref={printRef} style={{ height: '410px' }}>
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
                <td className={styles.name}>{store.owner} 님</td>
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
                  {business.businessNumber}
                </td>
              </tr>
              <tr>
                <th>상호</th>
                <td style={{ width: '25%', fontSize: '15px' }} align="center">
                  {store.name}
                </td>
                <th style={{ width: '14%' }}>성명</th>
                <td style={{ width: '20%', fontSize: '15px' }} align="center">
                  {store.owner}
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
                  {store.address}
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
            {orderProducts.map((orderProduct) => {
              return (
                <tbody key={orderProduct.productId}>
                  <tr>
                    <td className={styles.item}>{`${month} / ${day}`}</td>
                    <td className={styles.item}>{orderProduct.product.name}</td>
                    <td className={styles.article}>{orderProduct.count}</td>
                    <td className={styles.price}>
                      {orderProduct.product.price}
                    </td>
                    <td className={styles.sum}>{orderProduct.orderPrice}</td>
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
        <div>
          <Button
            variant="outlined"
            onClick={() => setMemoIsOpen(true)}
            style={{
              height: '30px',
              width: '120px',
              float: 'left',
              display: 'flex',
              bottom: '-10px',
              left: 0,
            }}
          >
            메모 추가하기
          </Button>
          <Button
            variant="contained"
            onClick={handleClick}
            style={{
              height: '30px',
              width: '90px',
              float: 'right',
              display: 'flex',
              bottom: '-10px',
              right: 0,
            }}
          >
            발행하기
          </Button>
        </div>
      </Modal>
    </>
  );
};
export default BillModal;
