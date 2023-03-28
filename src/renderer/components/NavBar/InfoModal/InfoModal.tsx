import Modal from '../../InfoModal/Modal'
import styles from './InfoModal.module.scss';
import { Button, Typography } from '@mui/material';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoModal = ({ isOpen, setIsOpen }: IProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div style={{ margin: '15px 10px' }}>
        <Typography variant="h5">확인</Typography>
        <div>
          <p className={styles.upper}>사업자가 존재하지 않습니다.</p>
          <p className={styles.lower}>첫 번째 사업자를 먼저 생성해주세요.</p>
        </div>
        <div style={{ width: '100%' }}>
          <Button
            variant="contained"
            className={styles.deleteButton}
            onClick={() => setIsOpen(false)}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InfoModal;
