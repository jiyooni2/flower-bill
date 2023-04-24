import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './FindPassword.module.scss'
import Modal from 'renderer/components/Modal/Modal';
import ChangePasswordModal from './ChangePasswordModal';
import { ChangePasswordInput, ChangePasswordOutput } from '../../../../../main/auth/dtos/change-password.dto'
import InfoModal from 'renderer/components/InfoModal/InfoModal';
import { switched } from '../validation';


interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindPasswordModal = ({isOpen, setIsOpen}: IProps) => {
  const [infoIsOpen, setInfoIsOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState({ownerId: '', code: '', password: ''});
  const [inputs, setInputs] = useState({
    ownerId: '',
    code: '',
    password: '',
  })
  const [changePasswordIsOpen, setChangePasswordIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setInputs({ownerId: '', code: '', password: ''});
    setErrors({ownerId: '', code: '', password: ''});
  }, [])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const validations = switched(name, value);
    if (validations.success) {
      setInputs({...inputs, [name]: value});
      setErrors({...inputs, [name]: ''})
    } else {
      setErrors({...inputs, [name]: validations.error})
    }
  }

  const passwordHandler = () => {
    if (Object.values(inputs).length > 0 && Object.values(errors).length === 0) {
      console.log('here')
      const data : ChangePasswordInput = {
        ownerId: inputs.ownerId,
        findPasswordCode: inputs.code,
        newPassword: inputs.password,
      }

      window.electron.ipcRenderer.sendMessage('change-password', data);
      window.electron.ipcRenderer.on(
        'change-password',
        ({ ok, error }: ChangePasswordOutput) => {
          if (ok) {
            setInfoIsOpen(true);
          } else {
            if (error.startsWith('존재')) {
              setErrors({...errors, ownerId: error})
            } else if (error.startsWith('패스워드')) {
              setErrors({...errors, password: error})
            }
          }
        }
      );
    } else {
      let ownerId, code, password = '';
      if (!inputs.ownerId) ownerId = "* 아이디가 입력되지 않았습니다."
      if (!inputs.code) code = "* 비밀번호 변경 코드가 입력되지 않았습니다."
      if (!inputs.password) password = "* 새로운 비밀번호가 입력되지 않았습니다."
      setErrors({ ownerId: ownerId, code: code, password: password})
      return;
    }
  };

  return (
    <>
      <InfoModal isOpen={infoIsOpen} setIsOpen={setInfoIsOpen} text="비밀번호가 재설정되었습니다!" />
      <ChangePasswordModal
        isOpen={changePasswordIsOpen}
        setIsOpen={setChangePasswordIsOpen}
      />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={styles.container}>
                <div className={styles.content}>
                  <h1 className={styles.title} style={{ textAlign: 'center', lineHeight: '25px'}}>
                    비밀번호를 찾고자하는 아이디와 비밀번호 변경 코드,<br />새 비밀번호를 입력해주세요.
                  </h1>
                  <div style={{ width: '60%' }}>
                      <TextField
                        fullWidth
                        label="아이디"
                        name="ownerId"
                        variant="filled"
                        onChange={changeHandler}
                        helperText={errors.ownerId ? errors.ownerId : " "}
                        error={errors.ownerId.length > 0}
                        value={inputs.ownerId}
                      />
                      <TextField
                        fullWidth
                        label="비밀번호 변경 코드"
                        name="code"
                        variant="filled"
                        onChange={changeHandler}
                        helperText={errors.code ? errors.code : " "}
                        error={errors.code.length !== 0}
                        value={inputs.code}
                      />
                      <TextField
                        fullWidth
                        label="새 비밀번호"
                        name="password"
                        variant="filled"
                        onChange={changeHandler}
                        helperText={errors.password ? errors.password: " "}
                        error={errors.password.length > 0}
                        value={inputs.password}
                        sx={{ marginBottom: '20px'}}
                      />
                    <Button variant="contained" sx={{ float: 'right', marginTop: '-5px'}} onClick={passwordHandler}>비밀번호 찾기</Button>
                  </div>
                  </div>
        </div>
      </Modal>
    </>
  );
};

export default FindPasswordModal;
