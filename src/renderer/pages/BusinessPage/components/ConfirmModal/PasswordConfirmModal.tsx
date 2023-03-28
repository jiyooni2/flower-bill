import Modal from './Modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  businessState,
  businessesState,
  passwordCheckState,
  tokenState,
} from 'renderer/recoil/states';
import { useState } from 'react';
import styles from './PasswordConfirmModal.module.scss';
import {
  CheckPasswordInput,
  CheckPasswordOutput,
} from 'main/auth/dtos/check-password.dto';
import { Button, Typography } from '@mui/material';
import { DeleteBusinessOutput } from 'main/business/dtos/delete-business.dto';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { Business } from 'main/business/entities/business.entity';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordConfirmModal = ({ isOpen, setIsOpen }: IProps) => {
  const token = useRecoilValue(tokenState);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [checked, setChecked] = useRecoilState(passwordCheckState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [business, setBusiness] = useRecoilState(businessState)

  const clickHandler = () => {
    const check: CheckPasswordInput = {
      password,
      token,
    };

    window.electron.ipcRenderer.sendMessage('check-password', {
      ...check,
      businessId: business.id,
    });

    window.electron.ipcRenderer.on(
      'check-password',
      ({ ok, error }: CheckPasswordOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('delete-business', {
            businessId: business.id,
            token,
          });

          window.electron.ipcRenderer.on(
            'delete-business',
            ({ ok, error }: DeleteBusinessOutput) => {
              if (ok) {
                window.electron.ipcRenderer.sendMessage('get-businesses', {
                  token,
                  businessId: business.id,
                });
                window.electron.ipcRenderer.on(
                  'get-businesses',
                  (args: GetBusinessesOutput) => {
                    setBusinesses(args.businesses as Business[]);
                    setBusiness(businesses[0]);
                  }
                );
              }
              if (error) {
                console.log(error);
              }
            }
          );
          setIsOpen(false);
          setChecked(true);
        }
        if (error) {
          console.log(error);
          setChecked(false);
          setError('비밀번호를 확인해주세요.');
        }
      }
    );
  };

  const keyEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter' && e.nativeEvent.isComposing === false) {
      clickHandler();
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (event.target.value == '') {
      setError('');
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div style={{ margin: '15px 10px' }}>
        <Typography variant="h5">비밀번호 확인</Typography>
        <div>
          <p className={styles.label}>비밀번호를 입력해주십시오.</p>
          <p className={styles.pwContainer}>
            <input
              type="password"
              className={styles.pwInput}
              onChange={changeHandler}
              onKeyDown={keyEnterHandler}
            />
            {<span className={styles.errorMessage}>{error}</span>}
          </p>
        </div>
        <div style={{ width: '100%' }}>
          <Button
            variant="contained"
            className={styles.deleteButton}
            disabled={!password ? true : false}
            onClick={clickHandler}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordConfirmModal;
