import { CreateBusinessInput, CreateBusinessOutput } from 'main/business/dtos/create-business.dto';
import Modal from './Modal';
import { Button, TextField, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';
import { Business } from 'main/business/entities/business.entity';
import { useEffect, useRef, useState } from 'react';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BusinessModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [businessNumber, setBusinessNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const numberRef = useRef<HTMLInputElement>();
  const nameRef = useRef<HTMLInputElement>();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, dataName: string) => {
    const { value } = event.target;
    if (dataName === 'owner') setOwner(value)
    else if (dataName === 'name') setName(value)
    else if (dataName === 'number') {
      setBusinessNumber(value)
    }
    else setAddress(value)
  }

  const validation = (businessNumber: string, owner: string, address: string) => {
    if (!businessNumber) {
      window.alert('사업자 등록번호를 입력해주시기 바랍니다.')
      numberRef.current.focus()
      return;
    } else if (businessNumber.length != 10) {
      window.alert('사업자 등록번호를 확인해주십시오.')
      numberRef.current.focus()
      return;
    }

    if (!owner) {
      window.alert('성명을 입력해주시기 바랍니다.');
      nameRef.current.focus();
      return;
    }

    const pattern2 = /(([가-힣A-Za-z·\d~\-\.]{2,}(로|길).[\d]+)|([가-힣A-Za-z·\d~\-\.]+(읍|동)\s)[\d]+)/;
    if (address && address.length > 2){
      if (pattern2.test(address) == false){
        window.alert('주소를 확인하시기 바랍니다.')
        return;
      }
    }
    return true;
  }

  const handleSubmit = () => {
    if (name == '' && businessNumber == '' && owner == '' && name == '') {
      window.alert(
        '사업자를 생성할 수 없습니다.\n모든 입력 사항을 작성해주시기 바랍니다.'
      );
      return;
    }

    if (validation(businessNumber, owner, address) == true){
      if (window.confirm('정말 생성하시겠습니까?')) {
        const number = Number(businessNumber)
        const newBusiness: CreateBusinessInput = {
          name,
          token,
          businessNumber: number,
          businessOwnerName: owner,
          address,
        };
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
                ({ ok, error, businesses }: GetBusinessesOutput) => {
                  if (ok) {
                    setBusinesses(businesses);
                    console.log(businesses)
                  } else {
                    console.error(error);
                  }
                }
              );
            } else if (error) {
              console.log(error);
            }
          }
        );
      }
    } else {
      return;
    }
    setBusinessNumber('');
    setName('');
    setAddress('');
    setOwner('');
    setIsOpen(false);
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
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              ref={numberRef}
              sx={{
                width: '90%',
              }}
              label="사업자등록번호"
              name="businessNumber"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'number')
              }
              placeholder='"-"를 제외하고 작성해주시기 바랍니다.'
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
              ref={nameRef}
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
              placeholder='도로명 주소로 작성해주시기 바랍니다.'
              value={address}
            />
          </div>
          <Button
            type="submit"
            variant="text"
            sx={{ marginTop: '17px', float: 'right', marginRight: '10px' }}
            onClick={handleSubmit}
          >
            제출하기
          </Button>
        </div>
    </Modal>
  );
};

export default BusinessModal;
