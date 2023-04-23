import Modal from './Modal';
import styles from './DevelopModal.module.scss';
import { Button, Typography } from '@mui/material';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DevelopModal = ({ isOpen, setIsOpen }: IProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div style={{ margin: '15px 10px' }}>
        <Typography variant="h5">개발 중!</Typography>
        <div>
          <p className={styles.label}>해당 기능은 현재 개발 중입니다.</p>
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

export default DevelopModal;
