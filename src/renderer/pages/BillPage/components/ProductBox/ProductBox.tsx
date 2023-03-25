import { Product } from 'main/product/entities/product.entity';
import styles from './ProductBox.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, orderProductState, orderProductsState } from 'renderer/recoil/states';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';

interface IProps {
  product: Product;
}

const ProductBox = ({ product }: IProps) => {
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);
  const business = useRecoilValue(businessState)

  const onProductClick = () => {
    const orderProduct = orderProducts.find(
      (orderProduct) => orderProduct.product.id === product.id
    );

    orderProduct ? updateOrderProduct(product) : addOrderProduct(product);
  };

  const addOrderProduct = (product: Product) => {
    setOrderProducts((prev) => [
      ...prev,
      {
        business: business,
        businessId: business.id,
        product,
        count: 1,
        orderPrice: product.price,
      },
    ]);
  };

  const updateOrderProduct = (product: Product) => {
    setOrderProducts(
      orderProducts.map((orderProduct) => {
        if (orderProduct.product.id === product.id) {
          return {
            ...orderProduct,
            count: orderProduct.count + 1,
            orderPrice: orderProduct.orderPrice + product.price,
          };
        }

        return orderProduct;
      })
    );
  };

  return (
    <div className={styles.product_box} onClick={onProductClick}>
      <Typography
        sx={{ fontSize: '17px', marginBottom: '15px', fontWeight: '400', width: '80px' }}
      >
        {product.name}
      </Typography>
      <Typography sx={{ fontSize: '15px', fontWeight: '500', width: '70px' }} align="right">
        {product.price.toLocaleString('ko-KR')}원
      </Typography>
    </div>
  );
};

export default ProductBox;
