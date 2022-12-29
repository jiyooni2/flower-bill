import { Product } from 'main/product/entities/product.entity';
import styles from './ProductBox.module.scss';
import { useRecoilState } from 'recoil';
import { orderProductsState } from 'renderer/recoil/states';

interface IProps {
  product: Product;
}

const ProductBox = ({ product }: IProps) => {
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState);

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
      <div>{product.name}</div>
      <div>{product.price.toLocaleString('ko-KR')}원</div>
    </div>
  );
};

export default ProductBox;
