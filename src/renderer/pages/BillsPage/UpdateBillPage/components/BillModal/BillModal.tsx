import styles from './BillModal.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  billListState,
  billState,
  businessState,
  memoState,
  orderProductsState,
  storeState,
  tokenState,
} from 'renderer/recoil/states';
import Modal from './Modal';
import { useRef, useState } from 'react';
import { Button } from '@mui/material';
import MemoModal from '../MemoModal/MemoModal';
import ReactToPrint from 'react-to-print';
import { CreateOrderProductInput } from 'main/orderProduct/dtos/create-orderProduct.dto';
import { UpdateBillInput, UpdateBillOutput } from 'main/bill/dtos/update-bill.dto';
import { GetBillsOutput } from 'main/bill/dtos/get-bills.dto';
import { useNavigate } from 'react-router-dom';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const memo = useRecoilValue(memoState)
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);
  const [memoIsOpen, setMemoIsOpen] = useState<boolean>(false);
  const [bills, setBills] = useRecoilState(billListState)
  const [bill, setBill] = useRecoilState(billState)
  const store = useRecoilValue(storeState);
  const printRef = useRef();
  const navigate = useNavigate();


  const updateBillhandler = () => {
    const orderProductInputs: CreateOrderProductInput[] = [];

    orderProducts.map((item) => {
      console.log(item);
      orderProductInputs.push({
        count: item.count,
        productId: item.product.id,
        orderPrice: item.orderPrice,
      });
      console.log(orderProductInputs)
    });

    const storeId = store.id != 0 ? store.id : bill.storeId
    const newBill: UpdateBillInput = {
      businessId: bill.businessId,
      id: bill.id,
      token,
      storeId: storeId,
      memo,
      orderProductInputs: [...orderProductInputs],
    };

    window.electron.ipcRenderer.sendMessage('update-bill', newBill);
    window.electron.ipcRenderer.on(
      'update-bill',
      ({ ok, error }: UpdateBillOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-bills', newBill);
          window.electron.ipcRenderer.on(
            'get-bills',
            ({ ok, error, bills }: GetBillsOutput) => {
              if (ok) {
                setBills(bills);
              } else if (error) {
                console.log(error);
              }
            }
          );
          console.log('done')
        } else if (error) {
          console.log(error);
        }
      }
    );

    setOrderProducts([]);
    setIsOpen(false);
    navigate('/bills')
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
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div style={{ height: '410px' }}>
          <div
            style={{ height: '97%', overflow: 'auto', marginBottom: '12px' }}
            ref={printRef}
          >
            <table
              style={{ width: '100%', border: '0', marginTop: '0px' }}
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
                  <td className={styles.name}>
                    {store.owner ? store.owner : bill.store.owner} 님
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
                      {bill.business.businessNumber.toString().slice(0, 3)}-
                      {bill.business.businessNumber.toString().slice(3, 5)}-
                      {bill.business.businessNumber.toString().slice(5, 10)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>상호</th>
                  <td style={{ width: '25%', fontSize: '13px' }} align="center">
                    {bill.business.name}
                  </td>
                  <th style={{ width: '14%' }}>성명</th>
                  <td style={{ width: '20%', fontSize: '13px' }} align="center">
                    {bill.business.businessOwnerName}
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
              {orderProducts.map((orderProduct) => {
                return (
                  <tbody key={orderProduct.product.id}>
                    <tr>
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
                  </tbody>
                );
              })}
            </table>
            <div
              className={styles.sumDiv}
              style={{ display: 'flex', width: '100%' }}
            >
              <table style={{ display: 'flex', width: '100%' }}>
                <tbody style={{ width: '100%', display: 'flex' }}>
                  <tr
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginRight: '10px',
                    }}
                  >
                    <td className={styles.lastSum}>합&ensp;&ensp;계</td>
                    <td
                      style={{
                        color: 'black',
                      }}
                    >
                      ₩ {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <Button
              variant="contained"
              color="info"
              style={{
                height: '32px',
                width: '100%',
                float: 'left',
                display: 'flex',
                bottom: '-10px',
                right: 0,
              }}
              onClick={updateBillhandler}
            >
              저장하기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default BillModal;
