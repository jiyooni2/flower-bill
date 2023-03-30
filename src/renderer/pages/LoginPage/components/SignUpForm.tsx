import { IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import useInputs from 'renderer/hooks/useInputs';
import { Owner } from 'renderer/types';
import { Button } from '@mui/material';
import { useState } from 'react';
import './AuthForm.scss'
import { Link, NavLink } from 'react-router-dom';
import Modal from 'renderer/components/Modal/Modal';
import InfoModal from 'renderer/components/InfoModal/InfoModal';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface Errors {
  name: string;
  id: string;
  password: string;
}

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm = ({isOpen, setIsOpen}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({ name: '', id: '', password: '' });
  const [{ nickname, ownerId, password }, handleChange] = useInputs<Owner>({
    nickname: '',
    ownerId: '',
    password: '',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };


  const validation = (nickname: string, ownerId: string, password: string) => {
    if (!nickname && !ownerId && !password ){
      setErrors({ name: '닉네임이 입력되지 않았습니다.', id: '아이디가 입력되지 않았습니다.', password: '비밀번호가 입력되지 않았습니다.' });
    } else if (!nickname || !ownerId || !password) {
      if (!nickname) {
        setErrors({ ...errors, name: '닉네임이 입력되지 않았습니다.' });
      } else if (nickname && nickname.length < 3) {
        setErrors({ ...errors, name: '3글자 이상 입력해주십시오.' });
      } else {
        setErrors({ ...errors, name: '' });
      }

      if (!ownerId) {
        setErrors({ ...errors, id: '아이디가 입력되지 않았습니다.' });
      } else if (ownerId && ownerId.length < 3) {
        setErrors({ ...errors, id: '3글자 이상 입력해주십시오.' });
      } else {
        setErrors({ ...errors, id: '' });
      }

      console.log(password)

      if (password === '') {
        setErrors({ ...errors, password: '비밀번호가 입력되지 않았습니다.' });
      } else {
        setErrors({ ...errors, password: '' });
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
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <form onSubmit={handleSubmit} style={{ marginTop: '8%' }}>
          <div className="form-wrapper">
            <div className="text-wrapper">
              <TextField
                label="닉네임"
                name="nickname"
                error={errors.name.length > 0}
                variant="filled"
                helperText={errors.name.length > 0 && errors.name}
                onChange={handleChange}
                value={nickname}
              />
            </div>
            <div className="text-wrapper">
              <TextField
                label="ID"
                name="ownerId"
                error={errors.id.length > 0}
                helperText={errors.id.length > 0 && errors.id}
                variant="filled"
                onChange={handleChange}
                value={ownerId}
              />
            </div>
            <div className="text-wrapper">
              <TextField
                label="패스워드"
                name="password"
                error={errors.password.length > 0}
                helperText={errors.password.length > 0 && errors.password}
                variant="filled"
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                value={password}
                InputProps={{
                  endAdornment: (
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                  ),
                }}
              />
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
              <Button type="submit" variant="contained" sx={{ width: 'auto' }}>
                회원가입
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SignUpForm;
