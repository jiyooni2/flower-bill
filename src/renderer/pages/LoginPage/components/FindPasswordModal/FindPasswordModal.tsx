import { IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import useInputs from 'renderer/hooks/useInputs';
import { Owner } from 'renderer/types';
import { Button } from '@mui/material';
import { useState } from 'react';
import '../AuthForm.scss'
import Modal from 'renderer/components/Modal/Modal';
import ChangePasswordModal from './ChangePasswordModal'


interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindPasswordModal = ({isOpen, setIsOpen}: IProps) => {
  const [id, setId] = useState<string>('');
  const [errors, setErrors] = useState<string>('');
  const [changePasswordIsOpen, setChangePasswordIsOpen] = useState<boolean>(false);

  const keyHandler = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.nativeEvent.isComposing === false) {
      if (id === '') {
        setErrors('아이디가 입력되지 않았습니다.');
      } else {
        // id가 맞는지 확인
        // setChangePasswordIsOpen(true);
      }
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
    setErrors('')
  };

  return (
    <>
      <ChangePasswordModal
        isOpen={changePasswordIsOpen}
        setIsOpen={setChangePasswordIsOpen}
      />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <h2 style={{ marginBottom: '30px', fontWeight: '500' }}>
            비밀번호를 찾고자하는 아이디를 입력해주세요.
          </h2>
          <div style={{ width: '60%' }}>
            <div className="text-wrapper">
              <TextField
                fullWidth
                label="ID"
                name="ownerId"
                variant="filled"
                className=""
                onChange={changeHandler}
                helperText={errors}
                error={errors.length > 0}
                value={id}
                sx={{ marginBottom: '35px' }}
                onKeyDown={keyHandler}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FindPasswordModal;
