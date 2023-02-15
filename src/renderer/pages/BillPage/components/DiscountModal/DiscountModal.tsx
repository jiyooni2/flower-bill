import { TextField, Typography } from '@mui/material';
import styles from './DiscountModal.module.scss';
import Button from '@mui/material/Button';
// import { useRecoilState } from 'recoil';
// import { memoState } from 'renderer/recoil/states';
import { useState } from 'react';
import MiniModal from './MiniModal';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiscountModal = ({ isOpen, setIsOpen }: IProps) => {
  // const [memo, setMemo] = useRecoilState(memoState);
  const [discount, setDiscount] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(event.target.value);
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <MiniModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Typography variant="h6" sx={{ margin: '15px auto' }}>
        할인 추가하기
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginLeft: '-50px' }}>
        <TextField
          placeholder="할인율"
          multiline
          className={styles.discount}
          value={discount}
          onChange={handleChange}
        />
        <Typography variant="h6" sx={{ marginTop: '10px'}}>%</Typography>
      </div>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ width: '100px', margin: '0 auto' }}
      >
        확인
      </Button>
    </MiniModal>
  );
};

export default DiscountModal;
