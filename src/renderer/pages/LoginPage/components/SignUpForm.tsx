import { IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
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
  const [
    { nickname, ownerId, password, confirm, question, answer },
    onChange,
    setForm,
    errors,
    setErrors,
  ] = useInputsWithError(
    { nickname: '', ownerId: '', password: '', confirm: '', question: '', answer: '' },
    { nickname: '', ownerId: '', password: '', confirm: '', question: '', answer: '' }
  );


  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirm = () => setShowConfirm((show) => !show);


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password != confirm) {
      setErrors({ ...errors, confirm: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    if (!ownerId && !nickname && !password && !confirm && !question && !answer) {
      setErrors({
        ownerId: '아이디가 입력되지 않았습니다.',
        nickname: '닉네임이 입력되지 않았습니다.',
        password: '비밀번호가 입력되지 않았습니다.',
        confirm: '비밀번호가 입력되지 않았습니다.',
        question: '비밀번호 찾기 질문이 입력되지 않았습니다.',
        answer: '비밀번호 찾기 답이 입력되지 않았습니다.',
      });
      return;
    } else if (!ownerId || !nickname || !password || !confirm || !question || !answer) {
      if (!ownerId) setErrors(({ ...errors, ownerId: '아이디가 입력되지 않았습니다.' }));
      if (!nickname) setErrors({...errors, nickname: '닉네임이 입력되지 않았습니다.'});
      if (!password) setErrors({...errors, password: '비밀번호가 입력되지 않았습니다.'});
      if (!confirm) setErrors({...errors, confirm: '비밀번호가 입력되지 않았습니다.'});
      if (!question) setErrors({...errors, question: '비밀번호 찾기 질문이 입력되지 않았습니다.'});
      if (!answer) setErrors({...errors, answer: '비밀번호 찾기 답이 입력되지 않았습니다.'});
      return;
    } else if (ownerId && nickname && password && confirm && question && answer) {
      window.electron.ipcRenderer.sendMessage('create-owner', {
        nickname,
        ownerId,
        password,
        findPasswordAnswer: answer,
        findPasswordQuestion: question,
      });
      setForm({nickname: '', ownerId: '', password: '', confirm: '', question: '', answer: ''});
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
                      : '2글자 이상 작성하실 수 있습니다.'
                  }
                  // onChange={handleChange}
                  onChange={onChange}
                  value={nickname}
                />
                <TextField
                  size="small"
                  label="ID"
                  name="ownerId"
                  error={errors.ownerId.length > 0}
                  helperText={
                    errors.ownerId.length > 0
                      ? errors.ownerId
                      : '2글자 이상 작성하실 수 있습니다.'
                  }
                  variant="filled"
                  // onChange={handleChange}
                  onChange={onChange}
                  value={ownerId}
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
                  // onChange={handleChange}
                  onChange={onChange}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
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
                  helperText={
                    errors.confirm.length > 0
                      ? errors.confirm
                      : '8~16자리 내의 문자만 작성하실 수 있습니다.'
                  }
                  variant="filled"
                  // onChange={handleChange}
                  onChange={onChange}
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleClickShowConfirm}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </div>
              <div
                className="text-wrapper"
                style={{ display: 'flex', gap: '15px' }}
              >
                <TextField
                  size="small"
                  label="비밀번호 찾기 질문"
                  name="question"
                  error={errors.question.length > 0}
                  helperText={
                    errors.question.length > 0 ? errors.question : 'asdf'
                  }
                  variant="filled"
                  // onChange={handleChange}
                  onChange={onChange}
                  value={question}
                />
                <TextField
                  size="small"
                  label="비밀번호 찾기 답"
                  name="answer"
                  error={errors.answer.length > 0}
                  helperText={errors.answer.length > 0 ? errors.answer : 'asdf'}
                  variant="filled"
                  // onChange={handleChange}
                  onChange={onChange}
                  value={answer}
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
