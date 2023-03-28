import Modal from './Modal';
import styles from './InfoModal.module.scss';
import { Button, Typography } from '@mui/material';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
}

const InfoModal = ({ isOpen, setIsOpen, text }: IProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div style={{ margin: '15px 10px' }}>
        <Typography variant="h5">확인</Typography>
        <div>
          <p className={styles.label}>{text}</p>
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
