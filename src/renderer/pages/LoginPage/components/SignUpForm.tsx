import { IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import './AuthForm.scss'
import Modal from 'renderer/components/Modal/Modal';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signUpSubmitValidation, switched } from './validation';
import { CreateOwnerInput } from 'main/owner/dtos/create-owner.dto';

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
      if (validation.success) {
        setInputs({...inputs, [name]: value})
        setErrors({...errors, [name]: ''})
      } else {
        setErrors({...errors, [name]: validation.error})
      }
  };

  const handleSubmit = () => {
    const validation = signUpSubmitValidation(inputs);
    if (Object.values(validation).join('').length > 0) {
      setErrors(validation);
      return;
    } else {
      const data : CreateOwnerInput = {
        nickname: inputs.nickname,
        ownerId: inputs.ownerId,
        password: inputs.password,
        findPasswordCode: inputs.code
      }
      window.electron.ipcRenderer.sendMessage('create-owner', data);
      console.log('yup')

      setInputs({nickname: '', ownerId: '', password: '', code: ''});
      setIsOpen(false);
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
                  error={errors.nickname !== ''}
                  variant="filled"
                  helperText={
                    errors.nickname !== ''
                      ? errors.nickname
                      : ' '
                  }
                  onChange={changeHandler}
                  value={inputs.nickname}
                />
              </div>
              <div className="text-wrapper">
                <TextField
                  size="small"
                  label="아이디"
                  name="ownerId"
                  error={errors.ownerId !== ''}
                  helperText={
                    errors.ownerId !== ''
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
                  error={errors.password !== ''}
                  helperText={
                    errors.password !== ''
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
