import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Modal from 'renderer/components/Modal/Modal';
import SignUpForm from './components/SignUpForm';
import useInputs from 'renderer/hooks/useInputs';
import { LoginInput } from 'renderer/types';
import './components/AuthForm.scss';
import { LoginOutput } from 'auth/dtos/login.dto';
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
        <Modal isOpen={isSignUpPageOpen} setIsOpen={setIsSignUpPageOpen}>
          <SignUpForm />
        </Modal>
      )}
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
              onChange={handleChange}
              value={password}
            />
          </div>

          <div className="button-wrapper">
            <Button type="submit" variant="contained">
              로그인
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsSignUpPageOpen(true)}
            >
              회원가입
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
