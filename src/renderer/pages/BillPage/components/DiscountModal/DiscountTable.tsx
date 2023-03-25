import { TableCell, TableRow } from "@mui/material";
import { OrderProduct } from "main/orderProduct/entities/orderProduct.entity";
import styles from './DiscountTable.module.scss'
import { useState } from "react";
import { useRecoilState } from "recoil";
import { orderProductsState } from "renderer/recoil/states";

interface IProps {
  orderProduct: OrderProduct;
}

const DiscountTable = ({orderProduct}: IProps) => {
  const [discount, setDiscount] = useState<string>(orderProduct.orderPrice.toString());
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);
  const [clicked, setClicked] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(event.target.value);
  };

  const updatePriceHandler = () => {
    setClicked(true);
    setOrderProducts(
      orderProducts.map((item) => {
        if (item.product.id === orderProduct.product.id) {
          return {
            ...item,
            orderPrice: parseInt(discount),
          };
        }

        return item;
      })
    );
  };

  return (
    <>
      <TableRow>
        <TableCell size="small">{orderProduct.product.name}</TableCell>
        <TableCell size="small" style={{ width: '25%' }}>
          {orderProduct.product.price} 원
        </TableCell>
        <TableCell size="small" align="center">
          {!clicked ? (
            <>
              <input
                className={styles.dataInput}
                value={discount}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <input
                className={styles.updatedInput}
                value={discount}
                onChange={handleChange}
              />
            </>
          )}
          <span
            style={{ marginTop: '4px', marginLeft: '5px', fontSize: '14px' }}
          >
            원
          </span>
        </TableCell>
        <TableCell
          size="small"
          sx={{
            width: '23%',
            color: 'royalblue',
            cursor: 'pointer',
            fontWeight: '500',
            '&:hover': { color: '#228bf2' },
          }}
        >
          <span onClick={updatePriceHandler}>저장</span>
        </TableCell>
      </TableRow>
    </>
  );
};

export default DiscountTable;
