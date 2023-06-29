import { useRecoilState, useRecoilValue } from 'recoil';
import {
  businessState,
  memoState,
  orderProductsState,
  storeState,
  tokenState,
} from 'renderer/recoil/states';
import Modal from './Modal';
import { useEffect, useRef, useState } from 'react';
import { CreateBillInput } from 'main/bill/dtos/create-bill.dto';
import { GetBillOutput } from 'main/bill/dtos/get-bill.dto';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import Bill from './layout/Bill';
import { toast } from 'react-toastify';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);
  const [memo, setMemo] = useRecoilState(memoState);
  const [store, setStore] = useRecoilState(storeState);
  const [alert, setAlert] = useState({ success: '', error: '' });
  const printRef = useRef();
  const movePage = useNavigate();

  useEffect(() => {
    if (alert.error && !alert.success) {
      if (alert.error.startsWith('네트워크')) {
        toast.error(alert.error.split('네트워크')[1], {
          autoClose: 10000,
          position: 'top-right',
          hideProgressBar: true,
        });
      } else {
        toast.error(alert.error, {
          autoClose: 3000,
          position: 'top-right',
        });
      }
    } else if (alert.success && !alert.error) {
      toast.success(alert.success, {
        autoClose: 2000,
        position: 'top-right',
      });
    }
  }, [alert]);

  const handleClick = (condition: string) => {
    const orderProductInputs = orderProducts?.map((orderProduct) => ({
      businessId: business.id,
      count: orderProduct.count,
      productId: orderProduct.product.id,
      orderPrice: orderProduct.orderPrice,
    }));

    const newBill: CreateBillInput = {
      businessId: business.id,
      token,
      storeId: store ? store.id : null,
      memo,
      orderProductInputs,
    };

    window.electron.ipcRenderer.sendMessage('create-bill', newBill);
    const createBillRemover = window.electron.ipcRenderer.on(
      'create-bill',
      ({ ok, error }: GetBillOutput) => {
        if (ok) {
          if (condition === 'none') {
            setAlert({ success: '계산서가 생성되었습니다.', error: '' });
          }
          setOrderProducts([]);
          setMemo('');
          setStore(null);
          if (condition === 'save') {
            setAlert({ success: '계산서가 생성되었습니다.', error: '' });
            movePage('/bills');
          }
          createBillRemover();
        } else if (error) {
          console.error(error);
          if (error.startsWith('존재')) {
            setAlert({ success: '', error: error})
          } else {
            setAlert({ success: '', error: `네트워크 ${error}`})
          }
        }
      }
    );
  };

  const afterPrint = () => {
    setIsOpen(false);
    movePage('/bills');
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div style={{ height: '90%' }}>
          <Bill printRef={printRef} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '7px',
            }}
          >
            <Button
              variant="outlined"
              style={{
                height: '37px',
                width: '70%',
                float: 'left',
                display: 'flex',
                bottom: '-10px',
                left: 0,
              }}
              onClick={() => handleClick('save')}
            >
              저장하기
            </Button>
            <ReactToPrint
              onBeforePrint={() => handleClick('none')}
              onAfterPrint={afterPrint}
              trigger={() => (
                <Button
                  variant="contained"
                  onClick={() => handleClick('none')}
                  style={{
                    height: '37px',
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
