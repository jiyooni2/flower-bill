import './Bill.scss';
import '../common.scss';

import { useEffect, useState } from 'react';
import { BillService } from './../../main/bill/bill.service';
import { AppDataSource } from './../../main/main';
import { ipcRenderer } from 'electron';
import { OrderProduct } from './../../main/orderProduct/orderProduct.entity';
import { Product } from './../../main/product/entities/product.entity';

const Bill = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', []);

    window.electron.ipcRenderer.on('get-products', (args) => {
      setProducts(args.products as Product[]);
      console.log(products);
      setIsLoading(true);
    });
  }, []);

  const createBill = () => {
    window.electron.ipcRenderer.sendMessage('create-bill', ['data']);
  };

  const addOrderProduct = (product: Product) => {
    console.log(product);
    setOrderProducts([
      ...orderProducts,
      { id: orderProducts.length, product, count: 1 },
    ]);
  };

  const changeCount = (e: any, orderProduct: OrderProduct) => {
    let nextOrderProducts = orderProducts;
    let updatedProduct = nextOrderProducts.find(
      (p) => p.id === orderProduct.id
    );
    console.log(nextOrderProducts);
    console.log(updatedProduct);

    if (updatedProduct) {
      updatedProduct.count = parseInt(e.target.value);
    }

    setOrderProducts(nextOrderProducts);

    console.log(nextOrderProducts);

    // updatedProduct.count=
  };

  return (
    <div className="container">
      <div className="bill-container">
        <div className="header-container">
          <p className="font-title">계산서</p>
        </div>
        <div className="contents-container">
          {orderProducts.map((orderProduct, index) => {
            return (
              <div key={index} className="content">
                <span className="font-content">
                  {orderProduct.product.name}
                </span>
                <input
                  onInput={(e) => changeCount(e, orderProduct)}
                  value={orderProduct.count}
                  type="number"
                ></input>
                <span className="font-content">{orderProduct.count}</span>
                <span className="font-content">
                  \{orderProduct.product.price * orderProduct.count}
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
        <button onClick={createBill}>계산서 생성</button>
      </div>

      <div className="product-container">
        <div className="header-container">
          <p className="font-title">상품</p>
        </div>

        <div className="contents-container">
          <div className="content">
            {products?.map((product) => {
              return (
                <div
                  key={product.id}
                  className="content"
                  onClick={() => addOrderProduct(product)}
                >
                  <p className="font-content">{product.name}</p>
                  <p className="font-content">\{product.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
