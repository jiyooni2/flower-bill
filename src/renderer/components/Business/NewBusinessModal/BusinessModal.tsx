import { CreateBusinessInput, CreateBusinessOutput } from 'main/business/dtos/create-business.dto';
import Modal from './Modal';
import { Button, TextField, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';
import {useEffect, useRef, useState } from 'react';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { switched } from '../validation';
import useAddHyphen from 'renderer/hooks/useAddHyphen';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BusinessModal = ({ isOpen, setIsOpen }: IProps) => {
  const addHypen = useAddHyphen();
  const [business, setBusiness] = useRecoilState(businessState);
  const token = useRecoilValue(tokenState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [errors, setErrors] = useState({
    businessNumber: '',
    name: '',
    address: '',
    owner: '',
    type: '',
    sector: '',
  })
  const [inputs, setInputs] = useState({
    businessNumber: '',
    name: '',
    address: '',
    owner: '',
    type: '',
    sector: '',
  })
  const numberRef = useRef<HTMLInputElement>();
  const nameRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setInputs({businessNumber:'', name: '', address: '', owner: '', type: '', sector: ''});
    setErrors({businessNumber:'', name: '', address: '', owner: '', type: '', sector: ''})
  },[])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const validation = switched(name, value);
    if (validation.success) {
      setErrors({...errors, [name]: ''})
      setInputs({...inputs, [name]: value})
    } else {
      setErrors({...errors, [name]: validation.error})
    }
  }

  const handleSubmit = () => {
    if (!inputs.businessNumber || !inputs.name || !inputs.owner) {
      let businessNumber, name, owner;
      if (!inputs.businessNumber) businessNumber = '* 필수 정보'
      if (!inputs.name) name = '* 필수 정보'
      if (!inputs.owner) owner = '* 필수 정보'

      setErrors({...errors, businessNumber: businessNumber, name: name, owner: owner})
      return;
    } else {
        const newBusiness: CreateBusinessInput = {
          name: inputs.name,
          token,
          businessNumber: parseInt(inputs.businessNumber),
          businessOwnerName: inputs.owner,
          address: inputs.address,
          typeofBusiness: inputs.type,
          sector: inputs.sector,
        };

        window.electron.ipcRenderer.sendMessage('create-business', newBusiness);
        window.electron.ipcRenderer.on(
          'create-business',
          ({ ok, error }: CreateBusinessOutput) => {
            if (ok) {
              setBusiness(businesses[-1]);
              window.electron.ipcRenderer.sendMessage('get-businesses', {
                token,
                businessId: 1,
              });

              window.electron.ipcRenderer.on(
                'get-businesses',
                ({ ok, error, businesses }: GetBusinessesOutput) => {
                  if (ok) {
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
        setInputs({ businessNumber: '', name: '', address: '', owner: '', type: '', sector: ''})
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
              size="small"
              ref={numberRef}
              sx={{ width: '90%' }}
              error={errors.businessNumber !== '' && errors.businessNumber !== undefined}
              label="사업자등록번호"
              name="businessNumber"
              variant="filled"
              onChange={handleChange}
              helperText={errors.businessNumber ? errors.businessNumber : ' '}
              placeholder='"-"를 제외하고 작성해주시기 바랍니다.'
              value={addHypen(inputs.businessNumber)}
              inputProps={{ maxLength: 12, inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              sx={{ width: '90%' }}
              error={errors.name !== '' && errors.name !== undefined}
              label="상호"
              name="name"
              variant="filled"
              onChange={handleChange}
              helperText={errors.name ? errors.name : ' '}
              value={inputs.name}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              ref={nameRef}
              sx={{ width: '90%' }}
              error={errors.owner !== '' && errors.owner !== undefined}
              label="성명"
              name="owner"
              variant="filled"
              onChange={handleChange}
              helperText={errors.owner ? errors.owner: ' '}
              value={inputs.owner}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              sx={{ width: '90%' }}
              error={errors.address !== '' && errors.address !== undefined}
              label="사업장 소재지 (선택)"
              name="address"
              variant="filled"
              onChange={handleChange}
              helperText={errors.address ? errors.address: ' '}
              value={inputs.address}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              ref={nameRef}
              sx={{ width: '90%' }}
              error={errors.sector !== '' && errors.sector !== undefined}
              label="업종 (선택)"
              name="sector"
              variant="filled"
              onChange={handleChange}
              helperText={errors.sector ? errors.sector : ' '}
              value={inputs.sector}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              sx={{ width: '90%' }}
              error={errors.type !== '' && errors.type !== undefined}
              label="업태 (선택)"
              name="type"
              variant="filled"
              onChange={handleChange}
              helperText={errors.type ? errors.type : ' '}
              value={inputs.type}
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
