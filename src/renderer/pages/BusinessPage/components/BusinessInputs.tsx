import { Inputs } from '../types';
import React, { useEffect, useState } from 'react';
import Buttons from './Buttons';
import { useRecoilValue } from 'recoil';
import { businessState } from 'renderer/recoil/states';
import styles from './BusinessInput.module.scss'
import useAddHyphen from '../../../hooks/useAddHyphen'

const BusinessInputs = () => {
  const addHypen = useAddHyphen();
  const business = useRecoilValue(businessState);
  const [inputs, setInputs] = useState<Inputs>({
    businessNumber: '',
    name: '',
    businessOwnerName: '',
    address: '',
  })

  useEffect(() => {
    setInputs({ businessNumber: business.businessNumber.toString(), name: business?.name, businessOwnerName: business.businessOwnerName, address: business.address })
  }, [business]);

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {name, value} = event.target;
    if (name === 'businessNumber') {
      if (/^[0-9]*$/.test(value)) {
        setInputs({ ...inputs, businessNumber: value });
      } else {
        return;
      }
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  return (
    <div>
      <div className={styles.list}>
        <div className={styles.item}>
          <p className={styles.labels}>사업자 번호</p>
          <input
            name="businessNumber"
            maxLength={12}
            value={Number(inputs.businessNumber.length) < 10 ? inputs.businessNumber : addHypen(inputs.businessNumber)}
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
          <p className={styles.labels}>소유자 이름</p>
          <input
            name="businessOwnerName"
            value={inputs.businessOwnerName}
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
      <Buttons inputs={inputs} />
    </div>
  )
};

export default BusinessInputs;
