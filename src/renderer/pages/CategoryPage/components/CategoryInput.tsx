import styles from '../CategoryPage.module.scss'
import { Inputs } from '../types';
import { changeValidation } from '../validation';

type IProps = {
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  inputs: Inputs;
  errors: { name: string };
  setErrors: React.Dispatch<React.SetStateAction<{name: string}>>;
  nameInputRef: React.MutableRefObject<HTMLInputElement>;
}

const CategoryInput = ({ setInputs, inputs, setErrors, errors, nameInputRef } : IProps) => {
  const idChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({...inputs, categoryId: e.target.value})
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const validation = changeValidation(value);
    if (validation.success) {
      setErrors({...errors, name: ''})
      setInputs({...inputs, categoryName: value})
    } else {
      setErrors({...errors, name: validation.error})
    }
  };


  return (
    <div>
                <div>
                  <div className={styles.item}>
                    <p className={styles.labels}>카테고리 번호</p>
                    <input
                      className={`${styles.dataInput} ${styles.disabled}`}
                      value={inputs.categoryId}
                      onChange={idChangeHandler}
                      readOnly
                    />
                  </div>
                  <div className={styles.itemWithError}>
                    <p className={styles.labels}>카테고리명</p>
                    <input
                      className={
                        errors.name.length > 0
                          ? styles.hasError
                          : styles.dataInput
                      }
                      ref={nameInputRef}
                      value={inputs.categoryName}
                      onChange={changeHandler}
                      maxLength={20}
                      readOnly={!inputs.addNew}
                      required
                    />
                  </div>
                  {errors.name.length > 0 ? (
                    <span className={styles.errorMessage}>{errors.name}</span>
                  ) : !inputs.clicked ? (
                    <span className={styles.infoMessage}>
                      &apos;분류 추가하기&apos;를 눌러 카테고리를 추가하세요.
                    </span>
                  ) : (
                    <span
                      className={styles.infoMessage}
                      style={{ marginTop: '16.5px' }}
                    ></span>
                  )}
                  <div className={styles.item}>
                    <p className={styles.labels}>분류명</p>
                    <input
                      className={`${styles.dataInput} ${styles.disabled}`}
                      value={inputs.levelName}
                      readOnly
                    />
                  </div>
                  <div className={styles.item} hidden>
                    <p className={styles.labels} hidden>
                      부모 카테고리
                    </p>
                    <input
                      hidden
                      className={styles.dataInput}
                      defaultValue={inputs.parentCategoryName}
                      readOnly
                    />
                  </div>
                </div>
              </div>
  )
}

export default CategoryInput
