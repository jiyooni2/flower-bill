import './BillPage.scss';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { storeState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import { OrderProduct } from 'main/orderProduct/orderProduct.entity';
import ROUTES from '../../constants/routes';
import StoreSearchModal from '../../components/StoreSearchModal/StoreSearchModal';

const BillPage = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState<number[]>([]);
  const [memo, setMemo] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const store = useRecoilValue(storeState);

  const navigate = useNavigate();

  const createBill = () => {
    window.electron.ipcRenderer.sendMessage('create-bill', {
      orderProductIds: [1, 2, 3],
      memo: '하이',
    });
  };

  const addOrderProduct = (product: Product) => {
    console.log(product);
    setOrderProducts([
      ...orderProducts,
      { id: orderProducts.length, product, count: 1 },
    ]);
    setCounts([...counts, 1]);
  };

  // const changeCount = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   orderProduct: OrderProduct
  // ) => {
  //   const {
  //     value,
  //     dataset: { id },
  //   } = e.target;

  //   // if (value == '' || Number.isNaN(value)) {
  //   //   value = 0;
  //   // }

  //   const nextOrderProducts = orderProducts;
  //   const updatedProduct = nextOrderProducts.find(
  //     (p) => p.id === orderProduct.id
  //   );

  //   if (updatedProduct) {
  //     updatedProduct.count = parseInt(value);
  //   }

  //   setOrderProducts(nextOrderProducts);

  //   // have to make new obj
  //   const updateCounts = Array.from(counts);

  //   updateCounts[id] = parseInt(value);
  //   setCounts(updateCounts);
  //   console.log(counts);
  // };

  // useEffect(() => {
  // window.electron.ipcRenderer.sendMessage('get-products', {});
  // window.electron.ipcRenderer.on(
  //   'get-products',
  //   (args: GetProductsOutput) => {
  //     setProducts(args.products as Product[]);
  //     setIsLoading(false);
  //   }
  // );
  // window.electron.ipcRenderer.on(
  //   'search-store',
  //   ({ ok, error, stores }: SearchStoreOutput) => {
  //     if (ok) {
  //       console.log(stores);
  //       // need to select store
  //       // setStore(stores[0]);
  //     } else {
  //       alert(error);
  //     }
  //   }
  // );
  // }, []);

  return (
    <>
      <StoreSearchModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="container">
        <Button type="button" onClick={() => navigate(ROUTES.HOME)}>
          뒤로가기
        </Button>
        <div className="bill-container">
          <div className="header-container">
            <p className="font-title">영수증</p>
            <div className="store-container">
              <p>{store ? store.name : 'OOO'} 귀하</p>
              <Button onClick={() => setIsOpen(true)}>가게 검색</Button>
            </div>
          </div>

          <div className="contents-container">
            {orderProducts.map((orderProduct, index) => {
              return (
                <div className="content">
                  <span className="font-content">
                    {orderProduct.product.name}
                  </span>
                  <span className="input-container">
                    <input
                      data-id={index}
                      value={counts[index] === 0 ? '' : counts[index]}
                      type="number"
                    />
                    <span className="font-content">
                      \
                      {Number.isNaN(orderProduct.count)
                        ? 0
                        : orderProduct.product.price * orderProduct.count}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="total-price-container">
            <p className="font-content">총 금액</p>
            <p className="font-content">
              \
              {orderProducts.reduce((a, b) => {
                const acc = a + b.count * b.product.price;
                return acc;
              }, 0)}
            </p>
          </div>

          <Button onClick={createBill} variant="contained">
            계산서 생성
          </Button>
        </div>

        <div className="product-container">
          <div className="header-container">
            <p className="font-title">상품</p>
          </div>

          <div className="contents-container">
            <div className="content">
              {products?.map((product) => {
                return (
                  <div key={product.id} className="content">
                    <p className="font-content">{product.name}</p>
                    <p className="font-content">\{product.price}</p>
                    <Button
                      onClick={() => addOrderProduct(product)}
                      variant="contained"
                    >
                      추가
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillPage;
