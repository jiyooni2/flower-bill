import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import styles from './DiscountModal.module.scss';
import Button from '@mui/material/Button';
// import { useRecoilState } from 'recoil';
// import { memoState } from 'renderer/recoil/states';
import { useState } from 'react';
import MiniModal from './MiniModal';
import { useRecoilValue } from 'recoil';
import { orderProductsState } from 'renderer/recoil/states';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiscountModal = ({ isOpen, setIsOpen }: IProps) => {
  const orderProduct = useRecoilValue(orderProductsState);
  const [discount, setDiscount] = useState('');

  console.log(orderProduct);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(event.target.value);
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <MiniModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Typography variant="h6" sx={{ margin: '15px auto 10px auto' }}>
        할인 추가하기
      </Typography>
      {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginLeft: '-50px' }}>
        <TextField
          placeholder="할인율"
          multiline
          className={styles.discount}
          value={discount}
          onChange={handleChange}
        />
        <Typography variant="h6" sx={{ marginTop: '10px'}}>%</Typography>
      </div> */}
      <div style={{ width: '90%', margin: '0 auto' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{ fontWeight: 'bold', borderBottom: '1.5px solid' }}
              >
                <TableCell size="small">상품</TableCell>
                <TableCell size="small">금액</TableCell>
                <TableCell size="small">할인</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderProduct.map((item) => (
                <TableRow key={item.id}>
                  <TableCell size="small">{item.product.name}</TableCell>
                  <TableCell size="small">{item.product.price} 원</TableCell>
                  <TableCell
                    size="small"
                    sx={{ display: 'flex', flexDirection: 'row' }}
                  >
                    <input className={styles.dataInput} />
                    <span>%</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div></div>
      {/* <Button
        variant="contained"
        onClick={handleClick}
        sx={{ width: '100px', margin: '0 auto' }}
      >
        확인
      </Button> */}
    </MiniModal>
  );
};

export default DiscountModal;
