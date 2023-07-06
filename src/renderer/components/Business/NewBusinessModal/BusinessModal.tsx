import {
  CreateBusinessInput,
  CreateBusinessOutput,
} from 'main/business/dtos/create-business.dto';
import Modal from './Modal';
import { Button, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  businessState,
  businessesState,
  tokenState,
} from 'renderer/recoil/states';
import { useEffect, useState } from 'react';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import BusinessModalForm from './components/BusinessModalForm';
import { Inputs } from './types';
import { toast } from 'react-toastify';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BusinessModal = ({ isOpen, setIsOpen }: IProps) => {
  const token = useRecoilValue(tokenState);
  const setBusiness = useSetRecoilState(businessState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [alert, setAlert] = useState({ success: '', error: '' });
  const [inputs, setInputs] = useState<Inputs>({
    businessNumber: '',
    name: '',
    address: '',
    owner: '',
    type: '',
    sector: '',
    bank: '',
    bankNumber: '',
    bankOwner: '',
  });

  useEffect(() => {
    setInputs({
      businessNumber: '',
      name: '',
      address: '',
      owner: '',
      type: '',
      sector: '',
      bank: '',
      bankNumber: '',
      bankOwner: '',
    });

    const createBusinessRemover = window.electron.ipcRenderer.on(
      'create-business',
      ({ ok, error }: CreateBusinessOutput) => {
        if (ok) {
          setBusiness(businesses[-1]);
          window.electron.ipcRenderer.sendMessage('get-businesses', {
            token,
            businessId: 1,
          });
          setAlert({ success: '사업자가 생성되었습니다.', error: '' });
        } else if (error) {
          setAlert({ success: '', error });
          console.error(error);
        }
      }
    );

    const getBusinessesRemover = window.electron.ipcRenderer.on(
      'get-businesses',
      ({ ok, error, businesses }: GetBusinessesOutput) => {
        if (ok) {
          setBusinesses(businesses);
        } else {
          console.error(error);
          setAlert({ success: '', error });
        }
      }
    );

    return () => {
      createBusinessRemover();
      getBusinessesRemover();
    };
  }, []);

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

  const handleSubmit = () => {
    if (Object.values(inputs).join('').length > 0) {
      const newBusiness: CreateBusinessInput = {
        name: inputs.name,
        token,
        businessNumber: parseInt(inputs.businessNumber),
        businessOwnerName: inputs.owner,
        address: inputs.address,
        typeofBusiness: inputs.type,
        sector: inputs.sector,
        accountBank: inputs.bank,
        accountNumber: inputs.bankNumber,
        accountOwner: inputs.bankOwner,
      };

      window.electron.ipcRenderer.sendMessage('create-business', newBusiness);

      setInputs({
        businessNumber: '',
        name: '',
        address: '',
        owner: '',
        type: '',
        sector: '',
        bank: '',
        bankNumber: '',
        bankOwner: '',
      });
      setIsOpen(false);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6">사업자 등록하기</Typography>
      </div>
      <div style={{ height: '70%' }}>
        <BusinessModalForm inputs={inputs} setInputs={setInputs} />
        <Button
          type="submit"
          variant="contained"
          sx={{
            display: 'flex',
            bottom: 0,
            float: 'right',
            marginRight: '20px',
          }}
          onClick={handleSubmit}
        >
          제출하기
        </Button>
      </div>
    </Modal>
  );
};

export default BusinessModal;
