import './Bill.scss';
import { useEffect, useState } from 'react';
import { BillService } from './../../main/bill/bill.service';
import { AppDataSource } from './../../main/main';
import { ipcRenderer } from 'electron';
import { OrderProduct } from './../../main/orderProduct/orderProduct.entity';
import { Product } from './../../main/product/entities/product.entity';

const Bill = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [products, setProducts] = useState<Product[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', []);

    window.electron.ipcRenderer.on('get-products', (args) => {
      setProducts(args.products as Product[]);
      console.log(products);
      setIsLoading(true);
    });
  }, []);

  const onClick = () => {
    window.electron.ipcRenderer.sendMessage('create-bill', ['data']);
  };

  return (
    <div className="contents-container">
      <div className="bill-container">
        계산서
        <button onClick={onClick}>계산서 생성</button>
      </div>
      <div className="product-container">
        상품
        <div>
          {products?.map((product) => {
            return (
              <span key={product.id}>
                <>
                  {product.name} {product.price}
                </>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bill;
