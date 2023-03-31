import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import styles from './DiscountModal.module.scss';
import Button from '@mui/material/Button';
// import { useRecoilState } from 'recoil';
// import { memoState } from 'renderer/recoil/states';
import { useState } from 'react';
import MiniModal from './MiniModal';
import { useRecoilValue } from 'recoil';
import { orderProductsState } from 'renderer/recoil/states';
import TrendingFlatOutlinedIcon from '@mui/icons-material/TrendingFlatOutlined';
import DiscountTable from './DiscountTable';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiscountModal = ({ isOpen, setIsOpen }: IProps) => {
  const orderProducts = useRecoilValue(orderProductsState);

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <MiniModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Typography variant="h5" sx={{ margin: '25px auto 10px auto' }}>
        판매가 수정하기
      </Typography>
      <div
        style={{
          width: '90%',
          margin: '0 auto',
          height: '74%',
          marginBottom: '13px',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{ fontWeight: 'bold', borderBottom: '1.5px solid' }}
              >
                <TableCell size="small">상품</TableCell>
                <TableCell size="small">상품 가격</TableCell>
                <TableCell size="small">판매가</TableCell>
                <TableCell size="small"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderProducts?.map((item) => (
                <TableRow key={item.billId}>
                  <DiscountTable orderProduct={item} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {orderProducts != undefined && orderProducts?.length == 0 && (
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '100px',
              fontSize: '14px',
              color: 'dimgray',
            }}
          >
            주문 상품이 없습니다.
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleClick}
          size="small"
          sx={{ width: '50%', backgroundColor: 'lightgray' }}
        >
          닫기
        </Button>
      </div>
    </MiniModal>
  );
};

export default DiscountModal;
