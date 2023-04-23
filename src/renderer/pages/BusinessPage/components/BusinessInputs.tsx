import styles from '../BusinessPage.module.scss'
import { Inputs } from '../types';
import { nameValidation, numberValidation, ownerValidation } from '../../StorePage/validation';
import React, { useState } from 'react';


type IProps = {
  inputs: Inputs;
  setInputs : React.Dispatch<React.SetStateAction<Inputs>>;
}

const BusinessInputs = ({ inputs, setInputs } : IProps) => {
  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const [errors, setErrors] = useState<Inputs>({
      businessNumber: '',
      name: '',
      businessOwnerName: '',
      address: '',
    })

    const {name, value} = event.target;
    let validation;

    switch (name) {
      case 'number': validation = numberValidation(value);
      case 'name': validation = nameValidation(value);
      case 'owner': validation = ownerValidation(value);
      case 'address': validation;
    }

    if (validation.success) {
      setErrors({...errors, [name]: ''})
      setInputs({...inputs, [name]: value})
    } else {
      setErrors({...errors, [name]: validation.error})
    }
  };

  return (
    <div>
      <div>
        <div className={styles.item}>
          <p className={styles.labels}>사업자 번호</p>
          <input
            name="number"
            value={inputs.businessNumber}
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
            name="owner"
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
    </div>
  )
};

export default BusinessInputs;
