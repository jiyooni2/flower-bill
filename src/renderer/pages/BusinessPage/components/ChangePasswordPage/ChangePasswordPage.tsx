import useInputs from 'renderer/hooks/useInputs';
import styles from './ChangePasswordPage.module.scss';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { businessState, tokenState } from 'renderer/recoil/states';
import { ChangePasswordOutput } from 'main/auth/dtos/change-password.dto';


const ChangePasswordPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const navigate = useNavigate();
  const [{ origin, newPW, confirm }, handleChange] = useInputs({
    origin: '',
    newPW: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({
    origin: '',
    new: '',
    confirm: '',
  })

  const updateDataHandler = () => {
    // api와 맞지 않아서 보류
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div style={{ textAlign: 'center' }}>
          <Typography sx={{ marginTop: '27%' }} variant="h5">
            비밀번호 변경
          </Typography>
        </div>
        <div>
          <div
            className={
              errors.origin.length > 0 ? styles.itemWithError : styles.item
            }
          >
            <p className={styles.labels}>기존 비밀번호</p>
            <input
              name="origin"
              value={origin}
              className={
                errors.origin.length > 0 ? styles.hasError : styles.dataInput
              }
              onChange={handleChange}
            />
          </div>
          {errors.origin && (
            <span className={styles.errorMessage}>{errors.origin}</span>
          )}
          <div
            className={
              errors.new.length > 0 ? styles.itemWithError : styles.item
            }
          >
            <p className={styles.labels}>새로운 비밀번호</p>
            <input
              name="new"
              value={newPW}
              className={
                errors.new.length > 0 ? styles.hasError : styles.dataInput
              }
              onChange={handleChange}
            />
          </div>
          {errors.new && (
            <span className={styles.errorMessage}>{errors.new}</span>
          )}
          <div
            className={
              errors.confirm.length > 0 ? styles.itemWithError : styles.item
            }
          >
            <p className={styles.labels}>비밀번호 재확인</p>
            <input
              name="confirm"
              value={confirm}
              className={
                errors.confirm.length > 0 ? styles.hasError : styles.dataInput
              }
              onChange={handleChange}
            />
          </div>
          {errors.confirm && (
            <span className={styles.errorMessage}>{errors.confirm}</span>
          )}
        </div>
        <div className={styles.buttonList}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/seller')}
            sx={{ background: 'darkgray', '&:hover': { background: 'gray' }, height: '30px' }}
          >
            뒤로가기
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={updateDataHandler}
            sx={{ height: '30px'}}
          >
            비밀번호 변경하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
