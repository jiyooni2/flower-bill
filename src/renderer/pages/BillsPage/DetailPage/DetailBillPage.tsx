import { Button } from '@mui/material';
import BillPartPage from '../BillPart/BillPartPage';
import { useRecoilValue } from 'recoil';
import {
  billState,
  businessState,
  orderProductsState,
  tokenState,
} from 'renderer/recoil/states';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleOutline, LocalPrintshopSharp } from '@mui/icons-material';
import BillModal from './BillModal/BillModal';
import { useEffect, useRef, useState } from 'react';
import DetailCard from './DetailCard';
import DetailTable from './DetailTable';
import { GetBillInput, GetBillOutput } from 'main/bill/dtos/get-bill.dto';
import { get } from 'http';
import { Bill } from 'main/bill/entities/bill.entity';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import { BillResult } from 'main/common/dtos/bill-result.dto';

const DetailBillPage = () => {
  const [alert, setAlert] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const printRef = useRef<HTMLElement>();
  const [updated, setUpdated] = useState<boolean>(false);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const { id } = useParams();
  const [bill, setBill] = useState<BillResult>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBillRemover = window.electron.ipcRenderer.on(
      'get-bill',
      ({ ok, error, bill }: GetBillOutput) => {
        if (ok) {
          setBill(bill);
          setIsLoading(false);

          new Date(bill.updatedAt) !== new Date(bill.createdAt)
            ? setUpdated(true)
            : setUpdated(false);
        } else {
          console.error(error);
        }
      }
    );

    const getBillInput: GetBillInput = {
      token,
      businessId: business.id,
      id: Number(id),
    };

    window.electron.ipcRenderer.sendMessage('get-bill', getBillInput);

    return () => {
      getBillRemover();
    };
  }, []);

  if (alert == true) {
    setTimeout(() => setAlert(false), 1500);
    setAlert(true);
  }

  return (
    <>
      {isLoading === false ? (
        <>
          <BillModal isOpen={isOpen} setIsOpen={setIsOpen} bill={bill} />
          <div
            style={{
              justifyContent: 'none',
              width: '100%',
              height: '100%',
              marginTop: '-10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to={'/bills'}>
                <ArrowBackRoundedIcon
                  fontSize="large"
                  sx={{
                    marginBottom: '8px',
                    cursor: 'pointer',
                    fontSize: '50px',
                    width: '50px',
                  }}
                />
              </Link>
              <Link to={'/update-bills'}>
                <Button
                  sx={{
                    margin: '16px 0px 8px 0px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    width: '150px',
                    paddingLeft: '20px',
                  }}
                >
                  계산서 수정하기{' '}
                  <ArrowRightAltIcon
                    sx={{ color: 'black', marginLeft: '10px' }}
                  />
                </Button>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '0px' }}>
              <div style={{ width: '11cm', margin: '1%' }}>
                <BillPartPage bill={bill} orderProducts={bill?.orderProducts} />
                {alert == false ? (
                  <Button
                    variant="contained"
                    sx={{
                      width: '96%',
                      marginLeft: '3.5%',
                      fontSize: '15px',
                      height: '35px',
                    }}
                    onClick={() => setIsOpen(true)}
                    startIcon={<LocalPrintshopSharp />}
                  >
                    프린트하기
                  </Button>
                ) : (
                  <span ref={printRef} style={{ color: 'green' }}>
                    <CheckCircleOutline sx={{ color: 'forestgreen' }} />
                  </span>
                )}
              </div>
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    width: '100%',
                    height: '93%',
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <DetailCard bill={bill} updated={updated} />
                  <DetailTable orderProducts={bill?.orderProducts} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default DetailBillPage;
