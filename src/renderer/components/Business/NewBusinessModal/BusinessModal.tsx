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
  const [type, setType] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [errors, setErrors] = useState({
    businessNumber: '',
    name: '',
    address: '',
    owner: '',
    type: '',
    sector: '',
  })
  const numberRef = useRef<HTMLInputElement>();
  const nameRef = useRef<HTMLInputElement>();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, dataName: string) => {
    const { value } = event.target;

    const numPattern = /^[0-9]*$/;
    const engkor = /^[ㄱ-ㅎ가-힣a-zA-Z]*$/;
    if (dataName === 'businessNumber') {
      if (!numPattern.test(value)) {
        setErrors({
          ...errors,
          businessNumber: '숫자 외의 문자는 작성하실 수 없습니다.',
        });
        return;
      } else if (value.length > 10) {
        setErrors({...errors, businessNumber: '10자까지 작성하실 수 있습니다.'})
      } else if (value == '' || value) {
        setErrors({ ...errors, businessNumber: '' });
        setBusinessNumber(value);
      }

    } else if (dataName === 'name') {
      if (value == '' || value) {
        setErrors({ ...errors, name: '' });
        setName(value);
      }

    } else if (dataName === 'owner') {
      if (!engkor.test(value)) {
        setErrors({
          ...errors,
          owner: '한글, 영문 외의 문자는 작성하실 수 없습니다.',
        });
        return;
      } else {
        setErrors({ ...errors, owner: '' });
        setOwner(value);
      }
    } else if (dataName === 'address') {
      setAddress(value)
    } else if (dataName === 'sector') {
      setSector(value);
      if (!engkor.test(value)) {
        setErrors({
          ...errors,
          sector: '한글, 영문 외의 문자는 작성하실 수 없습니다.',
        });
      } else if (value || value == '') {
        setErrors({ ...errors, sector: '' });
      }
    } else if (dataName === 'type') {
      setType(value)
      if (!engkor.test(value)) {
        setErrors({
          ...errors,
          type: '한글, 영문 외의 문자는 작성하실 수 없습니다. ',
        });
      } else if (value || value == '') {
        setErrors({ ...errors, type: '' });
      }
    }

    if (businessNumber.length == 10 && name.length > 0) {
      setErrors({...errors, businessNumber: ''})
    }
  }

  const handleSubmit = () => {
    if (businessNumber == '' && name == '' && owner == '') {
      setErrors({ ...errors, businessNumber: '사업자 등록 번호가 입력되지 않았습니다.', name: '상호명이 입력되지 않았습니다.', owner: '사업자명이 입력되지 않았습니다.' })
      return;
    } else if (businessNumber == '' || name == '' || owner == ''){
      if (!businessNumber) {setErrors({...errors, businessNumber: '사업자 등록 번호가 입력되지 않았습니다.'}); return;}
      if (!name) {setErrors({ ...errors, name: '상호가 입력되지 않았습니다.' }); return;}
      if (!owner) {setErrors({...errors, owner: '사업자명이 입력되지 않았습니다.'}); return;}
      return;
    } else {
        const newBusiness: CreateBusinessInput = {
          name,
          token,
          businessNumber: parseInt(businessNumber),
          businessOwnerName: owner,
          address,
        };
        window.electron.ipcRenderer.sendMessage('create-business', newBusiness);

        window.electron.ipcRenderer.on(
          'create-business',
          ({ ok, error }: CreateBusinessOutput) => {
            if (ok) {
              console.log('yes');
              window.electron.ipcRenderer.sendMessage('get-businesses', {
                token,
                businessId: 1,
              });

              window.electron.ipcRenderer.on(
                'get-businesses',
                ({ ok, error, businesses }: GetBusinessesOutput) => {
                  if (ok) {
                    console.log(businesses)
                    setBusinesses(businesses);
                  } else {
                    console.error(error);
                  }
                }
              );
            } else if (error) {
              console.error(error);
            }
          }
        );
        setBusinessNumber('');
        setName('');
        setAddress('');
        setOwner('');
        setType('');
        setSector('');
        setIsOpen(false);
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
      <div style={{ height: '70%' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              ref={numberRef}
              sx={{
                width: '90%',
              }}
              error={errors.businessNumber.length > 0}
              label="사업자등록번호"
              name="businessNumber"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'businessNumber')
              }
              helperText={errors.businessNumber}
              placeholder='"-"를 제외하고 작성해주시기 바랍니다.'
              value={businessNumber}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              error={errors.name.length > 0}
              label="상호"
              name="name"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'name')
              }
              helperText={errors.name}
              value={name}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              ref={nameRef}
              sx={{ width: '90%' }}
              error={errors.owner.length > 0}
              label="성명"
              name="owner"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'owner')
              }
              helperText={errors.owner}
              value={owner}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              error={errors.address.length > 0}
              label="사업장 소재지 (선택)"
              name="address"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'address')
              }
              helperText={errors.address}
              value={address}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              ref={nameRef}
              sx={{ width: '90%' }}
              error={errors.sector.length > 0}
              label="업종 (선택)"
              name="sector"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'sector')
              }
              helperText={errors.sector}
              value={sector}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              error={errors.type.length > 0}
              label="업태 (선택)"
              name="type"
              variant="filled"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, 'type')
              }
              helperText={errors.type}
              value={type}
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="text"
          sx={{
            display: 'flex',
            bottom: 0,
            float: 'right',
            marginTop: '25px',
            marginRight: '20px',
          }}
          onClick={handleSubmit}
        >
          제출하기
        </Button>
      </div>
    </Modal>
  );
};

export default BusinessModal;
