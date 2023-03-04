import { Button } from '@mui/material';
// import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import styles from './BillModal.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  billState,
  businessState,
  memoState,
  orderProductsState,
  storeState,
  tokenState,
} from 'renderer/recoil/states';
import Modal from './Modal';
import { useEffect, useRef, useState } from 'react';
import { CreateBillInput, CreateBillOutput } from 'main/bill/dtos/create-bill.dto';
import { GetBillOutput } from 'main/bill/dtos/get-bill.dto';
// import { Printer } from 'react-thermal-printer';
import MemoModal from '../MemoModal/MemoModal';
import { Bill } from 'main/bill/entities/bill.entity';
import { GetStoreOutput } from 'main/store/dtos/get-store.dto';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const orderProducts = useRecoilValue(orderProductsState);
  const memo = useRecoilValue(memoState);
  const [store, setStore] = useRecoilState(storeState);
  const [bill, setBill] = useRecoilState(billState);
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);
  const printRef = useRef();


  const handleClick = async () => {
    setIsOpen(false);
    const orderProductInputs = orderProducts.map((orderProduct) => ({
      key: orderProduct.id,
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

    window.electron.ipcRenderer.sendMessage('create-bill', newBill);
    window.electron.ipcRenderer.on(
      'create-bill',
      ({ ok, error }: CreateBillOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-bill', {
            token,
            businessId: business.id,
          });
          window.electron.ipcRenderer.on(
            'get-bill',
            (args: GetBillOutput) => {
              setBill(args.bill as Bill);
            }
          );
        }
        if (error) {
          window.alert(error);
        }
      }
    );
  };

  let sum = 0;
  orderProducts.map((items) => {
    sum += items.orderPrice * items.count;
  });

  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return (
    <>
      <MemoModal isOpen={isMemoOpen} setIsOpen={setIsMemoOpen} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div ref={printRef} style={{ height: '430px' }}>
          <table
            style={{ width: '100%', border: '0' }}
            cellPadding="0"
            cellSpacing="0"
            className="title"
          >
            <tr>
              <td align="center">
                <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
                  영&ensp;수&ensp;증
                </span>
              </td>
            </tr>

            <br />
          </table>
          <table
            style={{ width: '100%', border: '0' }}
            cellPadding="0"
            cellSpacing="0"
            className={styles.ownerData}
          >
            <tr>
              <td style={{ width: '45%' }}>
                <span style={{ fontSize: '10px', fontWeight: '400' }}>
                  (공급받는자용)
                </span>
              </td>
              <td className={styles.name}>{/* 구매자 */} 님</td>
              <td className={styles.for}>&ensp;귀하</td>
            </tr>
          </table>
          <table
            style={{ width: '100%' }}
            cellPadding="0"
            cellSpacing="0"
            className={`${styles.tbl} ${styles.stamp}`}
          >
            <tr>
              <td
                style={{ width: '7%' }}
                rowSpan={5}
                align="center"
                className={styles.owner}
              >
                공 급 자
              </td>
              <th style={{ width: '18%' }}>
                사업자
                <br />
                등록번호
              </th>
              <td colSpan={3} className={styles.businessNumberDiv}>
                {business.businessNumber}
              </td>
            </tr>
            <tr>
              <th>상호</th>
              <td style={{ width: '25%', fontSize: '15px' }} align="center">
                {business.name}
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
              <td align="center">{/* 업태 */}</td>
              <th>종목</th>
              <td align="center">{/* 업종 */}</td>
            </tr>
          </table>
          <table
            width="100%"
            cellSpacing="0"
            cellPadding="0"
            className={styles.tbl}
          >
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
          </table>
          <table
            width="100%"
            cellSpacing="0"
            cellPadding="0"
            className={styles.tbl}
          >
            <tr>
              <th>월일</th>
              <th>품목</th>
              <th>수량</th>
              <th>단가</th>
              <th>금액</th>
            </tr>
            {orderProducts.map((orderProduct, index) => {
              return (
                <tr key={index}>
                  <td className={styles.item}>{`${month} / ${day}`}</td>
                  <td className={styles.item}>{orderProduct.product.name}</td>
                  <td className={styles.article}>{orderProduct.count}</td>
                  <td className={styles.price}>{orderProduct.product.price}</td>
                  <td className={styles.sum}>{orderProduct.orderPrice}</td>
                </tr>
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => setIsMemoOpen(true)}
            style={{
              height: '30px',
              width: '100px',
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
