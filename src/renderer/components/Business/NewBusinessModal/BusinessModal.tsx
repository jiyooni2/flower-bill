import { useState } from 'react';
import styles from './BusinessModal.module.scss';
import Modal from './Modal';
import { Button, TextField, Typography } from '@mui/material';
import useInputs from 'renderer/hooks/useInputs';
import { CreateStore } from 'renderer/types';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BusinessModal = ({ isOpen, setIsOpen }: IProps) => {
  const [{ businessNumber, address, name, owner }, handleChange] =
    useInputs<CreateStore>({
      businessNumber: '',
      address: '',
      name: '',
      owner: '',
    });


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    window.electron.ipcRenderer.sendMessage('create-store', {
      businessNumber: Number(businessNumber),
      address,
      name,
      owner,
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6">사업장 등록하기</Typography>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="사업자등록번호"
              name="businessNumber"
              variant="filled"
              onChange={handleChange}
              value={businessNumber}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="상호"
              name="name"
              variant="filled"
              onChange={handleChange}
              value={name}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="성명"
              name="owner"
              variant="filled"
              onChange={handleChange}
              value={owner}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="사업장 소재지(선택)"
              name="address"
              variant="filled"
              onChange={handleChange}
              value={address}
            />
          </div>
          <Button
            type="submit"
            variant="text"
            sx={{ marginTop: '30px', float: 'right', marginRight: '5px' }}
          >
            제출하기
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BusinessModal;
