import { useEffect, useState } from 'react';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useRecoilState } from 'recoil';
import { productsState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import CreateProductModal from './components/CreateProductModal/CreateProductModal';
import styles from './UserPage.module.scss';

const UserPage = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [currentMenu, setCurrentMenu] = useState<'product' | 'category'>(
  //   'product'
  // );
  const [category, setCategory] = useState<string>('');

  -useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', {});
    window.electron.ipcRenderer.on(
      'get-products',
      (args: GetProductsOutput) => {
        setProducts(args.products as Product[]);
      }
    );
  }, []);

  return (
    <>
      <CreateProductModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.header}>
        <div>
          상품 찾기
          <input type="text" />
          <button>검색</button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.category_container}>
          <FormControl>
            <InputLabel>대분류</InputLabel>
            <Select label="대분류">
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="1">1</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>중분류</InputLabel>
            <Select label="중분류"></Select>
          </FormControl>
          <FormControl>
            <InputLabel>소분류</InputLabel>
            <Select label="소분류"></Select>
          </FormControl>
        </div>
        <div className={styles.product_container}></div>
        <div className={styles.detail_container}></div>
      </div>
    </>
  );
};

export default UserPage;
