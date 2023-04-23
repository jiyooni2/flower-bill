import { nameValidation } from "renderer/pages/ProductsPage/validation";
import { Inputs, StoreData } from "../types";
import { addressValidation, numberValidation, ownerValidation } from "../validation";
import styles from '../StorePage.module.scss';

type IProps = {
  setErrors: React.Dispatch<React.SetStateAction<StoreData>>;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  inputs: Inputs;
  errors: StoreData;
}

const StoreInput = ({ setErrors, setInputs, errors, inputs }: IProps) => {
  const changeStoreDataHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    let validation;
    switch (name) {
      case 'storeNumber': validation = numberValidation(value)
      case 'storeName': validation = nameValidation(value);
      case 'owner': validation = ownerValidation(value);
      case 'address': validation = addressValidation(value);
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
        <div
          className={
            errors.storeNumber.length > 0
              ? styles.itemWithError
              : styles.item
          }
        >
          <p className={styles.labels}>사업자 번호</p>
          <input
            name="storeNumber"
            value={inputs.storeNumber}
            className={
              errors.storeNumber.length > 0
                ? styles.hasError
                : styles.dataInput
            }
            onChange={changeStoreDataHandler}
            maxLength={10}
          />
        </div>
        {errors.storeNumber && (
          <span className={styles.errorMessage}>
            {errors.storeNumber}
          </span>
        )}
        <div
          className={
            errors.storeName.length > 0
              ? styles.itemWithError
              : styles.item
          }
        >
          <p className={styles.labels}>상호</p>
          <input
            name="storeName"
            value={inputs.storeName}
            className={
              errors.storeName.length > 0
                ? styles.hasError
                : styles.dataInput
            }
            onChange={changeStoreDataHandler}
          />
        </div>
        {errors.storeName && (
          <p className={styles.errorMessage}>{errors.storeName}</p>
        )}
          <div
            className={
              errors.owner.length > 0
                ? styles.itemWithError
                : styles.item
            }
          >
            <p className={styles.labels}>사업자 성명</p>
            <input
              name="owner"
              value={inputs.owner}
              className={
                errors.owner.length > 0
                  ? styles.hasError
                  : styles.dataInput
              }
              onChange={changeStoreDataHandler}
              maxLength={25}
            />
        </div>
        {errors.owner && (
          <p className={styles.errorMessage}>{errors.owner}</p>
        )}
        <div
          className={
            errors.address.length > 0
              ? styles.itemWithError
              : styles.item
          }
         >
          <p className={styles.labels}>사업장 소재지</p>
          <input
            name="address"
            value={inputs.address}
            className={
              errors.address.length > 0
                ? styles.hasError
                : styles.dataInput
            }
            onChange={changeStoreDataHandler}
            maxLength={50}
          />
        </div>
        {errors.address && (
          <p className={styles.errorMessage}>{errors.address}</p>
        )}
      </div>
    </div>
  )
};

export default StoreInput;
