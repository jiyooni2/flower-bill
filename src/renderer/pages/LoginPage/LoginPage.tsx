import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import SignUpForm from './components/SignUpForm';
import './components/AuthForm.scss';
import { LoginOutput } from 'main/auth/dtos/login.dto';
import { useRecoilState } from 'recoil';
import { tokenState } from 'renderer/recoil/states';
import FindPasswordModal from './components/FindPasswordModal/FindPasswordModal'

const LoginPage = () => {
  const [isSignUpPageOpen, setIsSignUpPageOpen] = useState<boolean>(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useRecoilState(tokenState);
  const [errors, setErrors] = useState({
    id: '',
    password: '',
  })

  const handleChangeID = (e:ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value == '' || e.target.value) {
      setErrors({...errors, id : ''})
      setOwnerId(e.target.value)
    }
  }

  const handleChangePW = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value == '' || e.target.value) {
      setErrors({ ...errors, password: '' });
      setPassword(e.target.value)
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ownerId !== '' && password != '') {
      window.electron.ipcRenderer.sendMessage('login', {
        ownerId,
        password,
      });

      window.electron.ipcRenderer.on(
        'login',
        ({ ok, token, error }: LoginOutput) => {
          if (ok) {
            setToken(token);
          } else {
            console.error(error);
            if (error.startsWith('없는')) {
              setErrors({
                id: '아이디를 확인해주세요.',
                password: '비밀번호를 확인해주세요.',
              });
            } else if (error.startsWith('비밀번호를')) {
              setErrors({ id: '', password: '비밀번호를 확인해주세요.' });
            } else {
              setErrors({ id: '', password: '' });
            }
          }
        }
      );
    }
  };

  return (
    <div className="content-container">
      {isSignUpPageOpen && (
        <SignUpForm isOpen={isSignUpPageOpen} setIsOpen={setIsSignUpPageOpen} />
      )}
      <FindPasswordModal isOpen={isPasswordOpen} setIsOpen={setIsPasswordOpen} />
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
                onChange={handleChangeID}
                value={ownerId}
                error={errors.id.length > 0}
                helperText={errors.id}
              />
            </div>
            <div className="text-wrapper">
              <TextField
                label="비밀번호"
                name="password"
                variant="filled"
                type="password"
                onChange={handleChangePW}
                value={password}
                error={errors.password.length > 0}
                helperText={errors.password}
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
              <div style={{ color: 'gray' }}>
                <span style={{ fontSize: '14px', cursor: 'pointer', }} onClick={() => setIsPasswordOpen(true)}>
                  비밀번호 찾기
                </span>
                <span
                  style={{
                    color: 'lightgray',
                    fontSize: '13px',
                    fontWeight: '400',
                  }}
                >
                  &ensp;|&ensp;
                </span>
                <span style={{ fontSize: '14px', color: 'gray' }}>
                  회원이 아니신가요?
                </span>
                <Button
                  variant="text"
                  onClick={() => {
                    setIsSignUpPageOpen(true);
                    setOwnerId('');
                    setPassword('');
                  }}
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
