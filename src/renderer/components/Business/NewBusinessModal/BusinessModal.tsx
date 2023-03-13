import { CreateBusinessInput, CreateBusinessOutput } from 'main/business/dtos/create-business.dto';
import Modal from './Modal';
import { Button, TextField, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';
import { Business } from 'main/business/entities/business.entity';
import { useState } from 'react';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BusinessModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [businessNumber, setBusinessNumber] = useState<number>(0);
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [owner, setOwner] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, dataName: string) => {
    const { value } = event.target;
    if (dataName === 'owner')setOwner(value)
    else if (dataName === 'name') setName(value)
    else if (dataName === 'number') setBusinessNumber(Number(value))
    else setAddress(value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newBusiness: CreateBusinessInput = {
      name,
      token,
      businessNumber: businessNumber,
      businessOwnerName: owner,
      address,
    };

    if (name == '' || businessNumber == 0 || owner == '' || name == '') {
      window.alert('사업자를 생성할 수 없습니다.\n모든 입력 사항을 작성해주시기 바랍니다.')
    } else {
      if (window.confirm('정말 생성하시겠습니까?')){
        window.electron.ipcRenderer.sendMessage('create-business', newBusiness);

        window.electron.ipcRenderer.on(
          'create-business',
          ({ ok, error }: CreateBusinessOutput) => {
            if (ok) {
              window.electron.ipcRenderer.sendMessage('get-businesses', {
                token,
                businessId: business.id,
              });
              window.electron.ipcRenderer.on(
                'get-businesses',
                (args: GetBusinessesOutput) => {
                  setBusinesses(args.businesses as Business[]);
                }
              );
            } else if (error) {
              console.log(error);
            }
          }
        );
        setBusinessNumber(0)
        setName('')
        setAddress('')
        setOwner('')
        setIsOpen(false);
      }
    }
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
        <Typography variant="h6">사업자 등록하기</Typography>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="사업자등록번호"
              name="businessNumber"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'number')
              }
              value={businessNumber}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="상호"
              name="name"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'name')
              }
              value={name}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="성명"
              name="owner"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'owner')
              }
              value={owner}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="사업장 소재지(선택)"
              name="address"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'address')
              }
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
