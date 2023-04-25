import { Button } from '@mui/material';
import BillPartPage from '../BillPart/BillPartPage';
import { useRecoilValue } from 'recoil';
import { billState, orderProductsState } from 'renderer/recoil/states';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import { CheckCircleOutline, LocalPrintshopSharp } from '@mui/icons-material';
import BillModal from './BillModal/BillModal';
import { useEffect, useRef, useState } from 'react';
import DetailCard from './DetailCard';
import DetailTable from './DetailTable';

const DetailBillPage = () => {
  const bill = useRecoilValue(billState)
  const orderProducts = useRecoilValue(orderProductsState)
  const [alert, setAlert] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const printRef = useRef<HTMLElement>();
  const [updated, setUpdated] = useState<boolean>(false);

  useEffect(() => {
    new Date(bill.updatedAt) !== new Date(bill.createdAt)
      ? setUpdated(true)
      : setUpdated(false);
  }, [bill]);

  console.log('Date check', new Date(bill.updatedAt) !== new Date(bill.createdAt))

  if (alert == true) {
    setTimeout(() => setAlert(false), 1500);
    setAlert(true)
  }

  return (
    <>
      <BillModal isOpen={isOpen} setIsOpen={setIsOpen} />
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
              <ArrowRightAltIcon sx={{ color: 'black', marginLeft: '10px' }} />
            </Button>
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0px' }}>
          <div style={{ width: '11cm', margin: '1%' }}>
            <BillPartPage bill={bill} orderProducts={orderProducts} />
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
              <DetailTable orderProducts={orderProducts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DetailBillPage;
