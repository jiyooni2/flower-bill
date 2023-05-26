import React, { useEffect, useState } from 'react';
import Buttons from './Buttons';
import { useRecoilValue } from 'recoil';
import { businessState } from 'renderer/recoil/states';
import styles from './BusinessInput.module.scss';
import useAddHyphen from '../../../hooks/useAddHyphen';
import { Input, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { data } from 'renderer/components/Business/NewBusinessModal/bank';
import { Inputs } from '../BusinessPage.interface';

const BusinessInputs = () => {
  const addHypen = useAddHyphen();
  const business = useRecoilValue(businessState);
  const [inputs, setInputs] = useState<Inputs>({
    businessNumber: '',
    name: '',
    businessOwnerName: '',
    address: '',
    bank: '',
    bankNumber: '',
    bankOwner: '',
  });

  useEffect(() => {
    setInputs({
      businessNumber: `${business.businessNumber}`,
      name: business?.name,
      businessOwnerName: business.businessOwnerName,
      address: business.address,
      bank: business.accountBank,
      bankNumber: business.accountNumber,
      bankOwner: business.accountOwner,
    });
  }, [business]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'businessNumber' || name === 'bankNumber') {
      if (/^[0-9]*$/.test(value)) {
        setInputs({ ...inputs, businessNumber: value });
      } else {
        return;
      }
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const bankChangeHandler = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setInputs({ ...inputs, bank: value });
  };

  return (
    <div>
      <div className={styles.list}>
        <div style={{ width: '120%', height: '16rem' }}>
          <div className={styles.item}>
            <p className={styles.labels}>사업자 번호</p>
            <input
              name="businessNumber"
              maxLength={12}
              value={
                Number(inputs.businessNumber.length) < 10
                  ? inputs.businessNumber
                  : addHypen(inputs.businessNumber)
              }
              className={styles.dataInput}
              onChange={changeHandler}
            />
          </div>
          <div className={styles.item}>
            <p className={styles.labels}>사업장 이름</p>
            <input
              name="name"
              value={inputs.name}
              className={styles.dataInput}
              onChange={changeHandler}
            />
          </div>
          <div className={styles.item}>
            <p className={styles.labels}>사업장 주소</p>
            <input
              name="address"
              value={inputs.address}
              className={styles.dataInput}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div style={{ width: '120%', height: '16rem' }}>
          <div className={styles.item}>
            <p className={styles.labels}>소유자 이름</p>
            <input
              name="businessOwnerName"
              value={inputs.businessOwnerName}
              className={styles.dataInput}
              onChange={changeHandler}
              style={{ marginBottom: '-8px' }}
            />
          </div>
          <div className={styles.item} style={{ marginBottom: '7px'}}>
            <p className={styles.labels} style={{ marginTop: '11px' }}>
              계좌 번호
            </p>
            <div style={{ width: '100%' }}>
              <Select
                style={{
                  width: '35%',
                  height: '33px',
                  color: 'black',
                  marginRight: '10px',
                  fontSize: '14px',
                }}
                value={inputs.bank}
                onChange={bankChangeHandler}
                input={<Input />}
              >
                <MenuItem value="">직접 입력</MenuItem>
                {data.map((item, index) => (
                  <MenuItem value={item.name} key={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <input
                name="bankNumber"
                value={inputs.bankNumber}
                className={styles.dataInput}
                onChange={changeHandler}
                style={{ marginBottom: '10px', width: '51%' }}
              />
            </div>
          </div>
          <div className={styles.item}>
            <p className={styles.labels} style={{ marginTop: '11px' }}>
              계좌 소유주
            </p>
            <input
              name="bankOwner"
              value={inputs.bankOwner}
              className={styles.dataInput}
              onChange={changeHandler}
              style={{ marginTop: '5px' }}
            />
          </div>
        </div>
      </div>
      <Buttons inputs={inputs} />
    </div>
  );
};

export default BusinessInputs;
