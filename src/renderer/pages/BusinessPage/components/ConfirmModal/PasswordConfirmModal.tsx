import Modal from './Modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  businessState,
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

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordConfirmModal = ({ isOpen, setIsOpen }: IProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [checked, setChecked] = useRecoilState(passwordCheckState);

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
