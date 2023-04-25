import { Inputs } from '../types';
import { BusinessSwitched } from '../../StorePage/validation';
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
  const [errors, setErrors] = useState<Inputs>({
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
    const validation = BusinessSwitched(name, value)
    if (validation?.success) {
      setErrors({...errors, [name]: ''})
      setInputs({...inputs, [name]: value})
    } else {
      setErrors({...errors, [name]: validation?.error})
    }
  };

  return (
    <div>
      <div className={styles.list}>
        <div className={
            errors.businessNumber?.length > 0
              ? styles.itemWithError
              : styles.item
          }>
          <p className={styles.labels}>사업자 번호</p>
          <input
            name="businessNumber"
            maxLength={12}
            value={addHypen(inputs.businessNumber)}
            className={
              errors.businessNumber?.length > 0
                ? styles.hasError
                : styles.dataInput
            }
            onChange={changeHandler}
          />
        </div>
        {errors.businessNumber && (
          <p className={styles.errorMessage}>{errors.businessNumber}</p>
        )}
        <div className={
            errors.name?.length > 0
              ? styles.itemWithError
              : styles.item
          }>
          <p className={styles.labels}>사업장 이름</p>
          <input
            name="name"
            value={inputs.name}
            className={
              errors.name?.length > 0
                ? styles.hasError
                : styles.dataInput
            }
            onChange={changeHandler}
          />
        </div>
        {errors.name && (
          <p className={styles.errorMessage}>{errors.name}</p>
        )}
        <div className={
            errors.businessOwnerName?.length > 0
              ? styles.itemWithError
              : styles.item
          }>
          <p className={styles.labels}>소유자 이름</p>
          <input
            name="businessOwnerName"
            value={inputs.businessOwnerName}
            className={
              errors.businessOwnerName?.length > 0
                ? styles.hasError
                : styles.dataInput
            }
            onChange={changeHandler}
          />
        </div>
        {errors.businessOwnerName && (
          <p className={styles.errorMessage}>{errors.businessOwnerName}</p>
        )}
        <div className={
            errors.address?.length > 0
              ? styles.itemWithError
              : styles.item
          }>
          <p className={styles.labels}>사업장 주소</p>
          <input
            name="address"
            value={inputs.address}
            className={
              errors.address?.length > 0
                ? styles.hasError
                : styles.dataInput
            }
            onChange={changeHandler}
          />
        </div>
        {errors.address && (
          <p className={styles.errorMessage}>{errors.address}</p>
        )}
      </div>
      <Buttons inputs={inputs} />
    </div>
  )
};

export default BusinessInputs;
