import { Button } from '@mui/material';
import styles from '../BusinessPage.module.scss';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  businessesState,
  businessState,
  tokenState,
} from 'renderer/recoil/states';
import { Business } from 'main/business/entities/business.entity';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import {
  UpdateBusinessInput,
  UpdateBusinessOutPut,
} from 'main/business/dtos/update-busiess.dto';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DeleteModal from './DeleteModal/DeleteModal';
import { Inputs } from '../BusinessPage.interface';

type IProps = {
  inputs: Inputs;
};

const Buttons = ({ inputs }: IProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const setBusinesses = useSetRecoilState(businessesState);
  const [alert, setAlert] = useState({ success: '', error: '' });
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const getBusinessesRemover = window.electron.ipcRenderer.on(
      'get-businesses',
      ({ businesses }: GetBusinessesOutput) => {
        setBusinesses(businesses);
      }
    );

    const updateBusinessRemover = window.electron.ipcRenderer.on(
      'update-business',
      ({ ok, error }: UpdateBusinessOutPut) => {
        if (ok) {
          setAlert({ success: '사업자가 수정되었습니다.', error: '' });
          window.electron.ipcRenderer.sendMessage('get-businesses', {
            token,
            businessId: business.id,
          });
        }
        if (error) {
          console.log(error);
          setAlert({ success: '', error });
        }
      }
    );

    return () => {
      getBusinessesRemover();
      updateBusinessRemover();
    };
  }, []);

  useEffect(() => {
    if (
      business.businessNumber !== Number(inputs.businessNumber) ||
      business.address !== inputs.address ||
      business.businessOwnerName !== inputs.businessOwnerName ||
      business?.name !== inputs.name
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputs]);

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

  const updateDataHandler = () => {
    const newData: UpdateBusinessInput = {
      businessNumber: parseInt(inputs.businessNumber),
      address: inputs.address,
      name: inputs.name,
      businessOwnerName: inputs.businessOwnerName,
      token,
      businessId: business.id,
    };

    window.electron.ipcRenderer.sendMessage('update-business', {
      ...newData,
    });
  };

  return (
    <>
      <DeleteModal isOpen={isOpen} setIsOpen={setIsOpen} setAlert={setAlert} />
      <div className={styles.list}>
        <div className={styles.buttonList}>
          <Button
            variant="contained"
            size="small"
            onClick={updateDataHandler}
            disabled={disabled}
          >
            사업자 수정하기
          </Button>
        </div>
        <hr />
        <span
          style={{
            fontSize: '13px',
            color: 'darkgray',
            cursor: 'pointer',
          }}
          onClick={() => setIsOpen(true)}
        >
          사업자 삭제하기
        </span>
      </div>
    </>
  );
};

export default Buttons;
