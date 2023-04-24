import { Product } from 'main/product/entities/product.entity';
import styles from './ProductBox.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, orderProductsState } from 'renderer/recoil/states';
import { Typography } from '@mui/material';
import { StarOutlineRounded, StarRateRounded } from '@mui/icons-material';

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
      orderProducts
      .map((orderProduct) => {
        if (orderProduct.product.id === product.id) {
          return {
            ...orderProduct,
            count: orderProduct.count + 1,
            orderPrice: orderProduct.orderPrice,
          };
        }

        return orderProduct;
      })
    );
  };

  return (
    <div className={styles.product_box} onClick={onProductClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Typography
          sx={{
            fontSize: '17px',
            marginBottom: '30px',
            fontWeight: '400',
            width: '80px',
          }}
          className={styles.cutText}
        >
          {(product != undefined && product?.name) || ''}
        </Typography>
        {product.isFavorite ? (
          <StarRateRounded
            className={styles.favorite}
            sx={{ color: 'gold' }}
          />
        ) : (
          <StarOutlineRounded className={styles.favorite} color="action" />
        )}
      </div>
      <Typography sx={{ fontSize: '15px', fontWeight: '500' }} align="right">
        {product.price.toLocaleString('ko-KR')}원
      </Typography>
    </div>
  );
};

export default ProductBox;
