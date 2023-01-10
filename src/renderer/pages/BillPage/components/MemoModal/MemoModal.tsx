import { TextField } from '@mui/material';
import styles from './MemoModal.module.scss';
import Button from '@mui/material/Button';
import { useRecoilState } from 'recoil';
import { memoState } from 'renderer/recoil/states';
import Modal from 'renderer/components/Modal/Modal';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemoModal = ({ isOpen, setIsOpen }: IProps) => {
  const [memo, setMemo] = useRecoilState(memoState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
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
    </Modal>
  );
};

export default MemoModal;
