import { TextField } from '@mui/material';
import useInputs from 'renderer/hooks/useInputs';
import { Owner } from 'renderer/types';
import { Button } from '@mui/material';
import { useState } from 'react';
import './AuthForm.scss'
import { Link, NavLink } from 'react-router-dom';
import Modal from 'renderer/components/Modal/Modal';

interface Errors {
  text: string;
}

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm = ({isOpen, setIsOpen}: IProps) => {
  const [nameError, setNameError] = useState<Errors>({ text: '' });
  const [idError, setIdError] = useState<Errors>({ text: '' });
  const [passwordError, setPasswordError] = useState<Errors>({ text: '' });
  const [{ nickname, ownerId, password }, handleChange] = useInputs<Owner>({
    nickname: '',
    ownerId: '',
    password: '',
  });


  const validation = (nickname: string, ownerId: string, password: string) => {
    if (!nickname && !ownerId && !password ){
      window.alert('모든 입력을 빠짐없이 작성해주세요.')
    } else if (!nickname || !ownerId || !password) {
      if (!nickname) {
        setNameError({ text: '닉네임을 입력해주십시오.' });
      } else {
        setNameError({ text: ''})
      }

      if (!ownerId) {
        setIdError({ text: '아이디를 입력해주십시오.' });
      } else if (ownerId && ownerId.length < 3) {
        setIdError({ text: '3글자 이상 입력바랍니다.' });
      } else {
        setIdError({ text: '' });
      }

      console.log(password)

      if (password === '') {
        setPasswordError({ text: '비밀번호를 입력해주십시오.' });
      } else {
        setPasswordError({ text: '' });
      }
    } else {
      window.electron.ipcRenderer.sendMessage('create-owner', {
        nickname,
        ownerId,
        password,
      });
      window.location.replace('/')
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    validation(nickname, ownerId, password);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit}>
        <div className="form-wrapper">
          <div className="text-wrapper">
            <TextField
              label="닉네임"
              name="nickname"
              error={nameError.text.length > 0}
              variant="filled"
              helperText={nameError.text.length > 0 && nameError.text}
              onChange={handleChange}
              value={nickname}
            />
          </div>
          <div className="text-wrapper">
            <TextField
              label="ID"
              name="ownerId"
              error={idError.text.length > 0}
              helperText={idError.text.length > 0 && idError.text}
              variant="filled"
              onChange={handleChange}
              value={ownerId}
            />
          </div>
          <div className="text-wrapper">
            <TextField
              label="패스워드"
              name="password"
              error={passwordError.text.length > 0}
              helperText={passwordError.text.length > 0 && passwordError.text}
              variant="filled"
              onChange={handleChange}
              value={password}
            />
          </div>
          <div className="button-wrapper">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#EEEEEE',
                  color: '#1876d2',
                  '&:hover': { backgroundColor: '#bccee4', color: 'white' },
                }}
                onClick={() => setIsOpen(false)}
              >
                닫기
              </Button>
            <Button type="submit" variant="contained">
              회원가입
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SignUpForm;
