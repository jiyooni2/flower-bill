import styles from './MiniModal.module.scss';
import { Modal as MuiModal } from '@mui/material';

interface IModal {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const MiniModal = ({ isOpen, setIsOpen, children }: IModal) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <MuiModal open={isOpen} onClose={handleClose}>
      <div className={styles.minimodal_container}>
        {children}
      </div>
    </MuiModal>
  );
};

export default MiniModal;
