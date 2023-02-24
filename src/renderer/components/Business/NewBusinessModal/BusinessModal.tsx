import { useState } from 'react';
import styles from './BusinessModal.module.scss';
import Modal from './Modal';
import { Button, Typography } from '@mui/material';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BusinessModal = ({ isOpen, setIsOpen }: IProps) => {
  const [name, setName] = useState<string>('');
  const [businessNumber, setBusinessNumber] = useState<number>();
  const [businessOwnerName, setBusinessOwnerName] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const changeNumberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessNumber(parseInt(e.target.value));
  };

  const changeOwnerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessOwnerName(e.target.value);
  };

  const changeAddressHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleClick = () => {
    const newBusiness = {
      name: name,
      businessNumber: businessNumber,
      businessOwnerName: businessOwnerName,
      adress: address,
    };
    if (name === '' || businessNumber === 0 || businessOwnerName === '' || address === ''){
      window.alert(`새 사업자를 생성할 수 없습니다.${'\n'}모든 빈칸을 채워주세요.`)
    } else{
      console.log(newBusiness);
      if (window.confirm(`'${name}' 을 정말 생성하시겠습니까?`)){

      }
      window.electron.ipcRenderer.sendMessage('create-business', newBusiness);
      setIsOpen(false);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.infoContent}>
        <Typography
          variant="h5"
          sx={{ display: 'flex', justifyContent: 'space-around', fontWeight: '500' }}
        >
          새 사업자 추가하기
        </Typography>
        <div className={styles.list}>
          <div className={styles.item}>
            <p className={styles.labels}>사업자 이름</p>
            <input
              className={styles.dataInput}
              value={name}
              onChange={changeNameHandler}
            />
          </div>
          <div className={styles.item}>
            <p className={styles.labels}>사업자 번호</p>
            <input
              className={styles.dataInput}
              value={businessNumber}
              onChange={changeNumberHandler}
            />
          </div>
          <div className={styles.item}>
            <p className={styles.labels}>사업자 대표 이름</p>
            <input className={styles.dataInput} value={businessOwnerName} onChange={changeOwnerHandler} />
          </div>
          <div className={styles.item}>
            <p className={styles.labels}>사업자 주소</p>
            <input className={styles.dataInput} value={address} onChange={changeAddressHandler} />
          </div>
        </div>
        <div style={{ float: 'right' }}>
          <Button onClick={handleClick} variant="outlined">생성하기</Button>
        </div>
      </div>
    </Modal>
  );
};

export default BusinessModal;
