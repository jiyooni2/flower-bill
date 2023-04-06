import styles from './BillModal.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  billListState,
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
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);
  const memo = useRecoilValue(memoState);
  const store = useRecoilValue(storeState);
  const printRef = useRef();
  const movePage = useNavigate();

  const handleClick = async () => {
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
      ({ ok, error }: GetBillOutput) => {
        if (ok) {
          console.log('ok')
        } else if (error) {
          console.error(error);
        }
      }
    );
  };

  console.log(business)

  const afterPrint = () => {
    setIsOpen(false);
    setOrderProducts([]);
    movePage('/bills');
  }

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
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div style={{ height: '410px' }}>
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
                  <td className={styles.name}>
                    {store.owner.length > 0 ? store.owner : ''} 님
                  </td>
                  <td className={styles.for}>&ensp;귀하</td>
                </tr>
              </tbody>
            </table>
            <table
              style={{ width: '100%' }}
              cellPadding="0"
              cellSpacing="0"
              className={styles.body}
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
                  <td
                    colSpan={3}
                    style={{
                      fontSize: '14px',
                      height: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                      {business.businessNumber.toString().slice(0, 3)}-
                      {business.businessNumber.toString().slice(3, 5)}-
                      {business.businessNumber.toString().slice(5, 10)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>상호</th>
                  <td style={{ width: '25%', fontSize: '13px' }} align="center">
                    {business.name}
                  </td>
                  <th style={{ width: '14%' }}>성명</th>
                  <td style={{ width: '20%', fontSize: '13px' }} align="center">
                    {business.businessOwnerName}
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
                    style={{ fontSize: '13px', textAlign: 'center' }}
                  >
                    {business.address}
                  </td>
                </tr>
                <tr>
                  <th>업태</th>
                  <td align="center">{business.typeofBusiness}</td>
                  <th>종목</th>
                  <td align="center">{business.sector}</td>
                </tr>
              </tbody>
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
                  <td
                    className={styles.date}
                  >{`${year} . ${month} . ${day}`}</td>
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
              className={styles.body}
            >
              <tbody>
                <tr>
                  <th>월일</th>
                  <th>품목</th>
                  <th>수량</th>
                  <th>단가</th>
                  <th>공급가액</th>
                </tr>
              </tbody>
              <tbody>
                {orderProducts.length > 0 ? (
                  orderProducts.map((orderProduct) => {
                    return (
                      <tr key={orderProduct.id}>
                        <td className={styles.item}>{`${month} / ${day}`}</td>
                        <td className={styles.item}>
                          {orderProduct.product.name}
                        </td>
                        <td className={styles.article}>{orderProduct.count}</td>
                        <td className={styles.price}>
                          {orderProduct.orderPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </td>
                        <td className={styles.sum}>
                          {(orderProduct.orderPrice * orderProduct.count)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className={styles.item} style={{ height: '20px' }}></td>
                    <td className={styles.item}></td>
                    <td className={styles.article}></td>
                    <td className={styles.price}></td>
                    <td className={styles.sum}></td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.sumDiv}>
              <td className={styles.lastSum}>합&ensp;&ensp;계</td>
              <td
                style={{ float: 'right', marginRight: '10px', color: 'black' }}
              >
                ₩ {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </td>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '7px',
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              style={{
                height: '30px',
                width: '60%',
                float: 'left',
                display: 'flex',
                bottom: '-10px',
                left: 0,
              }}
              onClick={() => setIsOpen(false)}
            >
              닫기
            </Button>
            <ReactToPrint
              onBeforePrint={handleClick}
              onAfterPrint={afterPrint}
              trigger={() => (
                <Button
                  variant="contained"
                  onClick={handleClick}
                  style={{
                    height: '30px',
                    width: '100%',
                    float: 'right',
                    display: 'flex',
                    bottom: '-10px',
                    right: 0,
                  }}
                >
                  발행하기
                </Button>
              )}
              content={() => printRef.current}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default BillModal;
