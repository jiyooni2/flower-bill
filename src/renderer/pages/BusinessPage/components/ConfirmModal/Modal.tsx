import styles from './Modal.module.scss';
import { Modal as MuiModal } from '@mui/material';

interface IModal {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Modal = ({ isOpen, setIsOpen, children }: IModal) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <MuiModal open={isOpen} onClose={handleClose}>
      <div className={styles.modal_container}>{children}</div>
    </MuiModal>
  );
};

export default Modal;
