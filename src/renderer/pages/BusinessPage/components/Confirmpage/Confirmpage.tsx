import { useNavigate } from 'react-router-dom';
import styles from './ConfirmPage.module.scss'
import useInputs from 'renderer/hooks/useInputs';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, passwordCheckState, tokenState } from 'renderer/recoil/states';
import { CheckPasswordInput, CheckPasswordOutput } from 'main/auth/dtos/check-password.dto';
import { DeleteBusinessOutput } from 'main/business/dtos/delete-business.dto';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { Business } from 'main/business/entities/business.entity';
import { Button, Typography } from '@mui/material';


const ConfirmPage = () => {
  const token = useRecoilValue(tokenState);
  const [business, setBusiness] = useRecoilState(businessState);
  const [businesses, setBusinesses] = useRecoilState(businessesState)
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (e.target.value.length >= 0) {
      setErrors('')
    }
  }

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
          navigate('/seller')
        }
        if (error) {
          console.log(error);
          setErrors('비밀번호를 확인해주세요.');
        }
      }
    );
  };

  const keyEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter' && e.nativeEvent.isComposing === false) {
      clickHandler();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={errors.length == 0 ? styles.container : styles.errorContainer}>
        <p className={styles.label}>비밀번호를 입력하세요.</p>
        <p className={styles.pwContainer}>
          <input
            type="password"
            className={errors.length == 0 ? styles.pwInput : styles.error}
            onChange={changeHandler}
            onKeyDown={keyEnterHandler}
          />
        </p>
        <span className={styles.errorMessage}>{errors}</span>
      </div>
    </div>
  );
};

export default ConfirmPage;
