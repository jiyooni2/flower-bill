import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import MiniModal from './MiniModal';
import { useRecoilState } from 'recoil';
import { orderProductsState } from 'renderer/recoil/states';
import styles from './DiscountModal.module.scss';
import { ChangeEvent } from 'react';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiscountModal = ({ isOpen, setIsOpen }: IProps) => {
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, product: OrderProduct) => {
    const {value} = e.target;
    setOrderProducts(
      orderProducts?.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            id: item.id,
            orderPrice: Number(value),
          };
        }
        return item;
      })
    );
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
                <TableRow key={item ? item?.id : Math.random()}>
                  <TableCell size="small" style={{ width: '18%' }}>
                    {item?.product?.name || ''}
                  </TableCell>
                  <TableCell size="small" style={{ width: '26%' }}>
                    {item.product.price} 원
                  </TableCell>
                  <TableCell size="small" align="center">
                    <input
                      className={styles.dataInput}
                      onChange={(event) => handleChange(event, item)}
                    />
                    <span style={{ marginTop: '4px', marginLeft: '5px', fontSize: '14px' }}>
                      원
                    </span>
                  </TableCell>
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
    </MiniModal>
  );
};

export default DiscountModal;
