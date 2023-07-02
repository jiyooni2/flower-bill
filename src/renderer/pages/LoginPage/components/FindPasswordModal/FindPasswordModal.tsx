import { Button, IconButton, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './FindPassword.module.scss';
import Modal from 'renderer/components/Modal/Modal';
import { ChangePasswordOutput } from '../../../../../main/auth/dtos/change-password.dto';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import InfoModal from 'renderer/components/InfoModal/InfoModal';
import { toast } from 'react-toastify';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindPasswordModal = ({ isOpen, setIsOpen }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [successed, setSuccessed] = useState<boolean>(false);
  const [errors, setErrors] = useState({ ownerId: '', code: '', password: '' });
  const [inputs, setInputs] = useState({
    ownerId: '',
    code: '',
    password: '',
  });
  const [alert, setAlert] = useState({ success: '', error: '' });

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

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const passwordHandler = () => {
    if (!inputs.ownerId || !inputs.code || !inputs.password) {
      let ownerId,
        code,
        password = '';
      if (!inputs.ownerId) ownerId = '* 아이디가 입력되지 않았습니다.';
      if (!inputs.code) code = '* 비밀번호 변경 코드가 입력되지 않았습니다.';
      if (!inputs.password)
        password = '* 새로운 비밀번호가 입력되지 않았습니다.';
      setErrors({ ownerId: ownerId, code: code, password: password });
      return;
    } else {
      window.electron.ipcRenderer.sendMessage('change-password', {
        ownerId: inputs.ownerId,
        findPasswordCode: inputs.code,
        newPassword: inputs.password,
      });
      console.log(inputs);
      const changePasswordRemover = window.electron.ipcRenderer.on(
        'change-password',
        ({ ok, error }: ChangePasswordOutput) => {
          if (ok) {
            setSuccessed(true);
            setInputs({ ownerId: '', code: '', password: '' });
            setIsOpen(false);
          } else if (error) {
            setAlert({ ...alert, success: '에러가 발생하였습니다.' });
          }
        }
      );
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <InfoModal
        isOpen={successed}
        setIsOpen={setSuccessed}
        text="비밀번호가 재설정 되었습니다."
      />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1
              className={styles.title}
              style={{ textAlign: 'center', lineHeight: '25px' }}
            >
              비밀번호를 찾고자하는 아이디와 비밀번호 변경 코드,
              <br />새 비밀번호를 입력해주세요.
            </h1>
            <div style={{ width: '60%' }}>
              <TextField
                fullWidth
                label="아이디"
                name="ownerId"
                variant="filled"
                onChange={changeHandler}
                helperText={errors.ownerId ? errors.ownerId : ' '}
                error={errors.ownerId !== '' && errors.ownerId !== undefined}
                value={inputs.ownerId}
              />
              <TextField
                fullWidth
                label="비밀번호 변경 코드"
                name="code"
                variant="filled"
                onChange={changeHandler}
                helperText={errors.code ? errors.code : ' '}
                error={errors.code !== '' && errors.code !== undefined}
                value={inputs.code}
              />
              <TextField
                fullWidth
                label="새 비밀번호"
                name="password"
                variant="filled"
                error={errors.password !== '' && errors.password !== undefined}
                helperText={errors.password ? errors.password : ' '}
                onChange={changeHandler}
                type={showPassword ? 'text' : 'password'}
                value={inputs.password}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <Button
                variant="contained"
                sx={{ float: 'right', marginTop: '-5px' }}
                onClick={passwordHandler}
              >
                비밀번호 재설정하기
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FindPasswordModal;
