import { IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import './AuthForm.scss'
import Modal from 'renderer/components/Modal/Modal';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signUpSubmitValidation, switched } from './validation';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm = ({isOpen, setIsOpen}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    nickname: '',
    ownerId: '',
    password: '',
    code: '',
  })
  const [errors, setErrors] = useState({
    nickname: '',
    ownerId: '',
    password: '',
    code: '',
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validation = switched(name, value)
    console.log(validation)
      if (validation.success) {
        setInputs({...inputs, [name]: value})
        setErrors({...errors, [name]: ''})
      } else {
        setErrors({...errors, [name]: validation.error})
      }
  };

  const handleSubmit = () => {
    if (Object.values(inputs).length > 0 && Object.values(errors).length === 0) {
      window.electron.ipcRenderer.sendMessage('create-owner', {
        nickname: inputs.nickname,
        ownerId: inputs.ownerId,
        password: inputs.password,
        code: inputs.code
      });
      setInputs({nickname: '', ownerId: '', password: '', code: ''});
      setIsOpen(false);
    } else {
      setErrors(signUpSubmitValidation(inputs))
      return;
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <h1 className="title" style={{ marginTop: '3%', marginBottom: '4%' }}>
            Flower Bill
          </h1>
        </div>
          <div className="form-wrapper">
            <div style={{ width: '100%', marginBottom: '-15px' }}>
              <div
                className="text-wrapper"
                style={{ display: 'flex', gap: '15px' }}
              >
                <TextField
                  size="small"
                  label="닉네임"
                  name="nickname"
                  error={errors.nickname.length > 0}
                  variant="filled"
                  helperText={
                    errors.nickname.length > 0
                      ? errors.nickname
                      : ' '
                  }
                  // onChange={handleChange}
                  onChange={changeHandler}
                  value={inputs.nickname}
                />
              </div>
              <div className="text-wrapper">
                <TextField
                  size="small"
                  label="아이디"
                  name="ownerId"
                  error={errors.ownerId.length > 0}
                  helperText={
                    errors.ownerId.length > 0
                      ? errors.ownerId
                      : ' '
                  }
                  variant="filled"
                  onChange={changeHandler}
                  value={inputs.ownerId}
                />
              </div>
              <div className="text-wrapper">
                <TextField
                  size="small"
                  label="비밀번호"
                  name="password"
                  error={errors.password.length > 0}
                  helperText={
                    errors.password.length > 0
                      ? errors.password
                      : '8~16자리 내의 문자만 작성하실 수 있습니다.'
                  }
                  variant="filled"
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
              </div>
              <div className="text-wrapper">
                <TextField
                  size="small"
                  label="비밀번호 변경 코드"
                  name="code"
                  error={errors.code.length > 0}
                  helperText={
                    errors.code.length > 0
                      ? errors.code
                      : ' '
                  }
                  variant="filled"
                  onChange={changeHandler}
                  value={inputs.code}
                />
              </div>
            </div>
            <div className="signin-button">
              <Button
                variant="contained"
                sx={{
                  width: 'auto',
                  backgroundColor: '#EEEEEE',
                  color: '#1876d2',
                  '&:hover': { backgroundColor: '#bccee4', color: 'white' },
                }}
                onClick={() => setIsOpen(false)}
              >
                닫기
              </Button>
              <Button type="submit" variant="contained" sx={{ width: 'auto' }} onClick={() => handleSubmit()}>
                회원가입
              </Button>
            </div>
          </div>
      </Modal>
    </>
  );
};

export default SignUpForm;
