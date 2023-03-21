import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import Modal from 'renderer/components/Modal/Modal';
import SignUpForm from './components/SignUpForm';
import useInputs from 'renderer/hooks/useInputs';
import { LoginInput } from 'renderer/types';
import './components/AuthForm.scss';
import { LoginOutput } from 'main/auth/dtos/login.dto';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loginState, tokenState } from 'renderer/recoil/states';

const LoginPage = () => {
  const [isSignUpPageOpen, setIsSignUpPageOpen] = useState<boolean>(false);
  const [{ ownerId, password }, handleChange] = useInputs<LoginInput>({
    ownerId: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [token, setToken] = useRecoilState(tokenState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    window.electron.ipcRenderer.sendMessage('login', {
      ownerId,
      password,
    });

    window.electron.ipcRenderer.on(
      'login',
      ({ ok, token, error }: LoginOutput) => {
        if (ok) {
          setIsLoggedIn(true);
          setToken(token);
        } else {
          console.error(error);
        }
        //set token, businessId
      }
    );
  };

  return (
    <div className="content-container">
      {isSignUpPageOpen && (
        <SignUpForm isOpen={isSignUpPageOpen} setIsOpen={setIsSignUpPageOpen} />
      )}
      <div className="content">
        <h1
          className="title"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          Flower Bill
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-wrapper">
            <div className="text-wrapper">
              <TextField
                label="ID"
                name="ownerId"
                variant="filled"
                onChange={handleChange}
                value={ownerId}
              />
            </div>

            <div className="text-wrapper">
              <TextField
                label="비밀번호"
                name="password"
                variant="filled"
                type="password"
                onChange={handleChange}
                value={password}
              />
            </div>

            <div className="button-wrapper">
              <Button
                type="submit"
                variant="contained"
                style={{ width: '100%' }}
              >
                로그인
              </Button>
              <div>
                <span style={{ fontSize: '14px', color: 'gray' }}>
                  회원이 아니신가요?
                </span>
                <Button
                  variant="text"
                  onClick={() => setIsSignUpPageOpen(true)}
                  sx={{
                    color: 'steelblue',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'skyblue',
                    },
                  }}
                >
                  회원가입하기
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
