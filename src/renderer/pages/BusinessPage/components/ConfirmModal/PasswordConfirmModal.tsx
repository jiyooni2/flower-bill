import Modal from './Modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';
import { useState } from 'react';
import styles from './PasswordConfirmModal.module.scss'
import { DeleteBusinessOutput } from 'main/business/dtos/delete-business.dto';
import { CheckPasswordInput, CheckPasswordOutput } from 'auth/dtos/check-password.dto';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  purpose: string;
}

const PasswordConfirmModal = ({ isOpen, setIsOpen }: IProps) => {
  const token = useRecoilValue(tokenState);
  const businesses = useRecoilValue(businessesState);
  const [business, setBusiness] = useRecoilState(businessState);
  const [password, setPassword] = useState<string>('');

  const clickHandler = () => {
    const check: CheckPasswordInput = {
      password,
      token,
    };

    window.electron.ipcRenderer.sendMessage('check-password', {
      ...check,
      businessId: business.id,
    });

    window.electron.ipcRenderer.on(
      'check-password',
      ({ ok, error }: CheckPasswordOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('delete-business', {
            businessId: business.id,
            token,
          });

          window.electron.ipcRenderer.on(
            'delete-business',
            ({ ok, error }: DeleteBusinessOutput) => {
              if (ok) {
                setBusiness(businesses[0])
                setIsOpen(false);
              }
              if (error) {
                console.log(error);
                window.alert('비밀번호가 일치하지 않습니다.');
                setIsOpen(false);
              }
            }
          );
        }
        if (error) {
          console.log(error);
        }
      }
    );
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>
        <div>
          <p className={styles.label}>비밀번호를 입력해주십시오.</p>
          <p className={styles.pwContainer}>
            <input
              type="password"
              className={styles.pwInput}
              onChange={changeHandler}
            />
          </p>
        </div>
        <button
          className={styles.deleteButton}
          disabled={!password ? true : false}
          onClick={clickHandler}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

export default PasswordConfirmModal;
