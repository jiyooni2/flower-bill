import { Bill } from 'main/bill/entities/bill.entity';
import { useEffect, useState } from 'react';
import { BillService } from './../../main/bill/bill.service';
import { AppDataSource } from './../../main/main';
import { ipcRenderer } from 'electron';
import { OrderProduct } from './../../main/orderProduct/orderProduct.entity';
import { Product } from './../../main/product/entities/product.entity';

const BillPage = () => {
  const [orderProducts, setOrderProducts] = useState<typeof OrderProduct[]>();
  const [products, setProducts] = useState<typeof Product[]>();
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', []);

    window.electron.ipcRenderer.on('get-products', (args) => {
      console.log(args);
    });

    setIsLoadingProduct(true);
  }, []);

  const onClick = () => {
    window.electron.ipcRenderer.sendMessage('create-bill', ['data']);
  };

  return (
    <div>
      <div>
        계산서
        <button onClick={onClick}>계산서 생성</button>
      </div>
      <div>상품</div>
    </div>
  );
};

export default BillPage;
