import { TextField } from '@mui/material';
import styles from './MemoModal.module.scss';
import Button from '@mui/material/Button';
import { useRecoilState } from 'recoil';
import { billState, memoState } from 'renderer/recoil/states';
import Modal from './Modal';
import { useEffect } from 'react';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemoModal = ({ isOpen, setIsOpen }: IProps) => {
  const [memo, setMemo] = useRecoilState(memoState);
  const [currentBill, setCurrentBill] = useRecoilState(billState);

  useEffect(() => {
    setMemo(currentBill.memo)
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div style={{ height: '90%'}}>
        <TextField
          placeholder="작성된 메모가 없습니다."
          multiline
          minRows={8}
          className={styles.memo}
          value={memo}
          onChange={handleChange}
        />
      </div>
      <Button
        variant="contained"
        onClick={handleClick}
        className={styles.okbutton}
        sx={{ width: '80px'}}
      >
        확인
      </Button>
    </Modal>
  );
};

export default MemoModal;
