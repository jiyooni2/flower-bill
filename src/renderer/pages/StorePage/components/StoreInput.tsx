import { Inputs } from '../types';
import styles from '../StorePage.module.scss';
import useAddHyphen from 'renderer/hooks/useAddHyphen';

type IProps = {
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  inputs: Inputs;
};

const StoreInput = ({ setInputs, inputs }: IProps) => {
  const addHyphen = useAddHyphen();

  const changeStoreDataHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (name === 'storeNumber') {
      if (/^[0-9]*$/.test(value)) {
        setInputs({ ...inputs, storeNumber: value });
      } else {
        return;
      }
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  return (
    <div>
      <div>
        <div className={styles.item}>
          <p className={styles.labels}>사업자 번호</p>
          <input
            name="storeNumber"
            value={
              Number(inputs.storeNumber.length) < 10
                ? inputs.storeNumber
                : addHyphen(inputs.storeNumber)
            }
            className={styles.dataInput}
            onChange={changeStoreDataHandler}
            maxLength={12}
          />
        </div>
        <div className={styles.item}>
          <p className={styles.labels}>상호</p>
          <input
            name="storeName"
            value={inputs.storeName}
            className={styles.dataInput}
            onChange={changeStoreDataHandler}
          />
        </div>
        <div className={styles.item}>
          <p className={styles.labels}>사업자 성명</p>
          <input
            name="owner"
            value={inputs.owner}
            className={styles.dataInput}
            onChange={changeStoreDataHandler}
            maxLength={25}
          />
        </div>
        <div className={styles.item}>
          <p className={styles.labels}>사업장 소재지</p>
          <input
            name="address"
            value={inputs.address}
            className={styles.dataInput}
            onChange={changeStoreDataHandler}
            maxLength={50}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreInput;
