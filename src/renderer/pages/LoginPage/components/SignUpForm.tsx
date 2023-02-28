import { TextField } from '@mui/material';
import useInputs from 'renderer/hooks/useInputs';
import { Owner } from 'renderer/types';
import { Button } from '@mui/material';
import './AuthForm.scss';

const SignUpForm = () => {
  const [{ nickname, ownerId, password }, handleChange] = useInputs<Owner>({
    nickname: '',
    ownerId: '',
    password: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    window.electron.ipcRenderer.sendMessage('create-owner', {
      nickname,
      ownerId,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-wrapper">
        <div className="text-wrapper">
          <TextField
            label="닉네임"
            name="nickname"
            variant="filled"
            onChange={handleChange}
            value={nickname}
          />
        </div>
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
            label="패스워드"
            name="password"
            variant="filled"
            onChange={handleChange}
            value={password}
          />
        </div>
        <div className="button-wrapper">
          <Button type="submit" variant="contained">
            회원가입
          </Button>
          {/* 닫기 버튼 추가하기 */}
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
