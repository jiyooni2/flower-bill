import { IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import './AuthForm.scss'
import Modal from 'renderer/components/Modal/Modal';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CreateOwnerInput } from 'main/owner/dtos/create-owner.dto';
import { switched } from './validation';

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
    if (!inputs.ownerId || !inputs.nickname || !inputs.password || !inputs.code && Object.values(errors).join('') !== "") {
    let ownerId;
    let nickname;
    let password;
    let code;
    if (!inputs.ownerId) ownerId = '* 아이디가 입력되지 않았습니다.'
    if (!inputs.nickname) nickname = '* 닉네임이 입력되지 않았습니다.'
    if (!inputs.password) password = '* 비밀번호가 입력되지 않았습니다.'

    if (!inputs.code) code = '* 비밀번호 변경 코드가 입력되지 않았습니다.'

    setErrors({ ownerId: ownerId, nickname: nickname, password: password, code: code})
    return;
    } else if (inputs.password.length < 8) {
      setErrors({...errors, password: '* 8자 이상 작성해야합니다.'});
      return;
    } else if (inputs.code.length > 6 || inputs.code.length < 6) {
      setErrors({...errors, code: '* 6글자 코드를 작성하세요'})
      return;
    } else {
      const data : CreateOwnerInput = {
        nickname: inputs.nickname,
        ownerId: inputs.ownerId,
        password: inputs.password,
        findPasswordCode: inputs.code
      }
      window.electron.ipcRenderer.sendMessage('create-owner', data);
      console.log('회원 생성 성공')

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
                  error={errors.nickname !== "" && errors.nickname !== undefined}
                  variant="filled"
                  helperText={
                    errors.nickname
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
                  error={errors.ownerId !== '' && errors.ownerId !== undefined}
                  helperText={
                    errors.ownerId
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
                  error={errors.password !== '' && errors.password !== undefined}
                  helperText={
                    errors.password
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
                  error={errors.code !== "" && errors.code !== undefined}
                  helperText={
                    errors.code
                      ? errors.code
                      : '6자리 내 문자 혹은 숫자만 작성하실 수 있습니다.'
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
