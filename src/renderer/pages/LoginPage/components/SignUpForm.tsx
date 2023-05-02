import { IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { FormEvent, useState } from 'react';
import './AuthForm.scss'
import Modal from 'renderer/components/Modal/Modal';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useInputsWithError from 'renderer/hooks/useInputsWithError';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm = ({isOpen, setIsOpen}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputs, onChange, setForm, errors, setErrors] = useInputsWithError(
    { nickname: '', ownerId: '', password: '', confirm: '', code: ''},
    { nickname: '', ownerId: '', password: '', confirm: '', code: ''}
  );

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirm = () => setShowConfirm((show) => !show);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputs.password != inputs.confirm) {
      setErrors({ ...errors, confirm: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    if (!inputs.ownerId || !inputs.nickname || !inputs.password || !inputs.confirm || !inputs.code) {
      let ownerId, nickname, password, confirm, code = '';
      if (!inputs.ownerId) ownerId = '아이디가 입력되지 않았습니다.';
      if (!inputs.nickname) nickname = '닉네임이 입력되지 않았습니다.';
      if (!inputs.password) password = '비밀번호가 입력되지 않았습니다.';
      if (!inputs.confirm) confirm = '비밀번호가 입력되지 않았습니다.';
      if (!inputs.code) code = '비밀번호 찾기 코드가 입력되지 않았습니다.';
      setErrors({ ownerId: ownerId, nickname: nickname, password: password, confirm: confirm, code: code})
      return;
    } else if (Object.values(inputs).join('').length > 0 && Object.values(errors).join('').length === 0) {
      window.electron.ipcRenderer.sendMessage('create-owner', {
        nickname: inputs.nickname,
        ownerId: inputs.ownerId,
        password: inputs.password,
        findPasswordCode: inputs.code,
      });
      setForm({nickname: '', ownerId: '', password: '', confirm: '', code: ''});
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
        <form onSubmit={handleSubmit}>
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
                      : '3글자 이상 작성하실 수 있습니다.'
                  }
                  inputProps={{ minLength: 3 }}
                  onChange={onChange}
                  value={inputs.nickname}
                />
                <TextField
                  size="small"
                  label="ID"
                  name="ownerId"
                  error={errors.ownerId.length > 0}
                  helperText={
                    errors.ownerId.length > 0
                      ? errors.ownerId
                      : '3글자 이상 작성하실 수 있습니다.'
                  }
                  variant="filled"
                  inputProps={{ minLength: 3 }}
                  onChange={onChange}
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
                    errors.password.length > 0 ? errors.password : ' '
                  }
                  variant="filled"
                  onChange={onChange}
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
                  label="비밀번호 확인"
                  name="confirm"
                  error={errors.confirm.length > 0}
                  helperText={errors.confirm.length > 0 ? errors.confirm : ' '}
                  variant="filled"
                  onChange={onChange}
                  type={showConfirm ? 'text' : 'password'}
                  value={inputs.confirm}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleClickShowConfirm}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </div>
              <div className="text-wrapper">
                <TextField
                  size="small"
                  label="비밀번호 찾기 코드"
                  name="code"
                  error={errors.code.length > 0}
                  helperText={errors.code.length > 0 ? errors.code : ' '}
                  variant="filled"
                  onChange={onChange}
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
