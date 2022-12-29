import { useEffect, useState } from 'react';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import Button from '@mui/material/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useRecoilState } from 'recoil';
import { productsState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import CreateProductModal from './components/CreateProductModal/CreateProductModal';
import styles from './UserPage.module.scss';

const UserPage = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<'product' | 'category'>(
    'product'
  );
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
      <div className={styles.content_container}>
        <Button variant="contained" onClick={() => setCurrentMenu('product')}>
          상품 목록
        </Button>
        <Button variant="contained" onClick={() => setCurrentMenu('category')}>
          카테고리 목록
        </Button>
        <div className={styles.content}>
          {currentMenu === 'product' ? (
            <>
              <Button onClick={() => setIsOpen(true)}>상품 추가</Button>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">이름</TableCell>
                    <TableCell align="center">카테고리</TableCell>
                    <TableCell align="center">가격</TableCell>
                    <TableCell align="center">설정</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.slice(page * 5, page * 5 + 5).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell align="center">{product.name}</TableCell>
                      <TableCell align="center">{product.categoryId}</TableCell>
                      <TableCell align="center">
                        {product.price.toLocaleString('ko-KR')}원
                      </TableCell>
                      <TableCell>
                        <Button>수정</Button>
                        <Button>삭제</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className={styles.page_control}>
                <Button
                  onClick={() => {
                    if (page > 0) setPage((prev) => prev - 1);
                  }}
                >
                  &lt;
                </Button>
                {page + 1}
                <Button
                  onClick={() => {
                    if (page < products.length % 5) setPage((prev) => prev + 1);
                  }}
                >
                  &gt;
                </Button>
              </div>
            </>
          ) : (
            <div>카테고리 목록</div>
          )}
        </div>
      </div>
      {/* <div className={styles.content_container}>
        <p>카테고리 목록</p>
        <div className={styles.content} />
      </div> */}
    </>
  );
};

export default UserPage;
