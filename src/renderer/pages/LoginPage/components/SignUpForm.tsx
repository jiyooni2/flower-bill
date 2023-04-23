import { IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import './AuthForm.scss'
import Modal from 'renderer/components/Modal/Modal';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { switched } from './validation';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm = ({isOpen, setIsOpen}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputs, setInputs] = useState({
    nickname: '',
    ownerId: '',
    password: '',
    confirm: '',
    question: '',
    answer: ''
  })
  const [errors, setErrors] = useState({
    nickname: '',
    ownerId: '',
    password: '',
    confirm: '',
    question: '',
    answer: ''
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirm = () => setShowConfirm((show) => !show);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validation = switched(name, value)
    console.log(validation)
      if (validation.success) {
        setInputs({...inputs, [name]: value})
        setErrors({...errors, [name]: ''})
      } else {
        setErrors({...errors, [name]: validation.error})
      }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(errors).join('') === '' && Object.values(inputs).join('') !== '') {
      window.electron.ipcRenderer.sendMessage('create-owner', {
        nickname: inputs.nickname,
        ownerId: inputs.ownerId,
        password: inputs.password,
        findPasswordAnswer: inputs.answer,
        findPasswordQuestion: inputs.question,
      });
      setInputs({nickname: '', ownerId: '', password: '', confirm: '', question: '', answer: ''});
      setIsOpen(false);
    } else if (Object.values(inputs).join('') !== '') {
      if (inputs.password != inputs.confirm) {
        setErrors({...errors, confirm: '비밀번호가 일치하지 않습니다.'})
      }

      if (!inputs.ownerId) setErrors({...errors, ownerId: '아이디가 입력되지 않았습니다.'})
      if (!inputs.nickname) setErrors({...errors, nickname: '닉네임이 입력되지 않았습니다.'})
      if (!inputs.password || !confirm) setErrors({...errors, password: '비밀번호가 입력되지 않았습니다.'})
      if (!inputs.question) setErrors({...errors, question: '질문이 입력되지 않았습니다.'})
      if (!inputs.answer) setErrors({...errors, answer: '답안이 입력되지 않았습니다.'})

      if (inputs.password.length < 8) {
        setErrors({...errors, password: '8자 이상 작성해야합니다.'})
      } else if (inputs.password.length > 16) {
        setErrors({...errors, password: '16장 이상 작성 불가합니다.'})
      }
    } else {
      setErrors({nickname: '닉네임이 입력되지 않았습니다.', ownerId: '아이디가 입력되지 않았습니다.', password: '비밀번호가 입력되지 않았습니다.', confirm: '비밀번호가 입력되지 않았습니다.', question: '질문이 입력되지 않았습니다.', answer: '답안이 입력되지 않았습니다.'});
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
                      : ' '
                  }
                  // onChange={handleChange}
                  onChange={changeHandler}
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
                  error={errors.password.length > 0}
                  helperText={
                    errors.password.length > 0
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
                  label="비밀번호 확인"
                  name="confirm"
                  error={errors.confirm.length > 0}
                  helperText={
                    errors.confirm.length > 0
                      ? errors.confirm
                      : '8~16자리 내의 문자만 작성하실 수 있습니다.'
                  }
                  variant="filled"
                  onChange={changeHandler}
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
                    errors.question.length > 0 ? errors.question : ' '
                  }
                  variant="filled"
                  onChange={changeHandler}
                  value={inputs.question}
                />
                <TextField
                  size="small"
                  label="비밀번호 찾기 답"
                  name="answer"
                  error={errors.answer.length > 0}
                  helperText={errors.answer.length > 0 ? errors.answer : ' '}
                  variant="filled"
                  onChange={changeHandler}
                  value={inputs.answer}
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
