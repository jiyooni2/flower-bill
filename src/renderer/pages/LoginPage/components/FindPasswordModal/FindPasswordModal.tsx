import { Button, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import styles from './FindPassword.module.scss'
import Modal from 'renderer/components/Modal/Modal';
import { ChangePasswordOutput } from '../../../../../main/auth/dtos/change-password.dto'
import { switched } from '../validation';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import InfoModal from 'renderer/components/InfoModal/InfoModal';


interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindPasswordModal = ({isOpen, setIsOpen}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [successed, setSuccessed] = useState<boolean>(false);
  const [errors, setErrors] = useState({ownerId: '', code: '', password: ''});
  const [inputs, setInputs] = useState({
    ownerId: '',
    code: '',
    password: '',
  })

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const validations = switched(name, value);
    if (validations.success) {
      setInputs({...inputs, [name]: value});
      setErrors({...errors, [name]: ''})
    } else {
      setErrors({...inputs, [name]: validations.error})
    }
  }

  const passwordHandler = () => {
    if (!inputs.ownerId || !inputs.code || !inputs.password) {
      let ownerId, code, password = '';
      if (!inputs.ownerId) ownerId = "* 아이디가 입력되지 않았습니다."
      if (!inputs.code) code = "* 비밀번호 변경 코드가 입력되지 않았습니다."
      if (!inputs.password) password = "* 새로운 비밀번호가 입력되지 않았습니다."
      setErrors({ ownerId: ownerId, code: code, password: password})
      return;
    } else {
      window.electron.ipcRenderer.sendMessage('change-password', {
        ownerId: inputs.ownerId,
        findPasswordCode: inputs.code,
        newPassword: inputs.password,
      });
      window.electron.ipcRenderer.on(
        'change-password',
        (args: ChangePasswordOutput) => {
          if (args.ok) {
            console.log('ok')
          } else if (args.error) {
            console.log(args.error)
            if (args.error.startsWith('패스워드'))  {
              setErrors({...errors, password: '* 비밀번호 변경 코드가 일치하지 않습니다.'})
            }
            if (args.error.startsWith('존재')) {
              setErrors({...errors, ownerId: '* 존재하지 않는 사용자입니다.'})
            }
          }
        }
      );
      // setSuccessed(true);
      // setInputs({ownerId: '', code: '', password: ''})
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <InfoModal isOpen={successed} setIsOpen={setSuccessed} text="비밀번호가 재설정 되었습니다." />
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
                        error={errors.ownerId !== ''}
                        value={inputs.ownerId}
                      />
                      <TextField
                        fullWidth
                        label="비밀번호 변경 코드"
                        name="code"
                        variant="filled"
                        onChange={changeHandler}
                        helperText={errors.code ? errors.code : " "}
                        error={errors.code !== ''}
                        value={inputs.code}
                      />
                      <TextField
                        fullWidth
                        label="세 비밀번호"
                        name="password"
                        variant="filled"
                        error={errors.password !== '' && errors.password !== undefined}
                        helperText={
                          errors.password
                            ? errors.password
                            : ' '
                        }
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
                    <Button variant="contained" sx={{ float: 'right', marginTop: '-5px'}} onClick={passwordHandler}>비밀번호 재설정하기</Button>
                  </div>
                  </div>
        </div>
      </Modal>
    </>
  );
};

export default FindPasswordModal;
