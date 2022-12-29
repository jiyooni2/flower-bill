import { Modal, TextField } from '@mui/material';
import styles from './MemoModal.module.scss';
import Button from '@mui/material/Button';
import { useRecoilState } from 'recoil';
import { memoState } from 'renderer/recoil/states';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemoModal = ({ isOpen, setIsOpen }: IProps) => {
  const [memo, setMemo] = useRecoilState(memoState);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const handleClick = () => {
    handleClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className={styles.modal_container}>
        <TextField
          placeholder="메모를 입력하세요."
          multiline
          minRows={4}
          maxRows={12}
          className={styles.memo}
          value={memo}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={handleClick}>
          확인
        </Button>
      </div>
    </Modal>
  );
};

export default MemoModal;
