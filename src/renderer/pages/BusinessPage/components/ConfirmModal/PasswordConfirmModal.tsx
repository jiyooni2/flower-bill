import { Button } from '@mui/material';
import Modal from './Modal';
import { useRecoilState } from 'recoil';
import useInputs from 'renderer/hooks/useInputs';
import { businessState } from 'renderer/recoil/states';
import { CreateStore } from 'renderer/types';
import { useRef, useState } from 'react';
import styles from './PasswordConfirmModal.module.scss'

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
//name' | 'businessNumber' | 'businessOwnerName' | 'address
const PasswordConfirmModal = ({ isOpen, setIsOpen }: IProps) => {
  const [currentBusiness, setCurrentBusiness] = useRecoilState(businessState);
  const [pw, setPW] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [{ businessNumber, address, name, owner }, handleChange] =
    useInputs<CreateStore>({
      businessNumber: '',
      address: '',
      name: '',
      owner: '',
    });

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const newBusiness = {
  //     name,
  //     businessNumber: BigInt(businessNumber),
  //     businessOwnerName: owner,
  //     address,
  //   };

  //   if (name == '' || businessNumber == '' || owner == '' || name == '') {
  //     window.alert(
  //       '사업자를 생성할 수 없습니다.\n모든 입력 사항을 작성해주시기 바랍니다.'
  //     );
  //   } else {
  //     if (window.confirm('정말 생성하시겠습니까?')) {
  //       window.electron.ipcRenderer.sendMessage('create-business', newBusiness);
  //       setCurrentBusiness(newBusiness);
  //       console.log(newBusiness);
  //       setIsOpen(false);
  //     }
  //   }
  // };

  const keyPressHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing){
      // if (pw !== ) {
        // setHasError(true)
      // }
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPW(event.target.value)
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>
        <div>
          <p className={styles.label}>비밀번호를 입력해주십시오.</p>
          <p className={styles.pwContainer}>
            <input type="password" className={styles.pwInput} onKeyDown={keyPressHandler} onChange={changeHandler} />
          </p>
        </div>
        {hasError && <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>}
        {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleClick} variant='contained' size='small' sx={{ width: '50%', marginTop: '23px', marginLeft: '17px'}}>확인</Button>
        </div> */}
      </div>
    </Modal>
  );
};

export default PasswordConfirmModal;
