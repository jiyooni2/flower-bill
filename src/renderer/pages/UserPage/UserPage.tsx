import styles from './UserPage.module.scss';
import { useEffect, useState } from 'react';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { Product } from './../../../main/product/entities/product.entity';
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
import CreateProductModal from './components/CreateProductModal/CreateProductModal';
import { useRecoilState } from 'recoil';
import { productsState } from 'renderer/recoil/states';

const UserPage = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
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
        <p>상품 목록</p>
        <div className={styles.content}>
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
              {products.map((product) => (
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={products.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
      <div className={styles.content_container}>
        <p>카테고리 목록</p>
        <div className={styles.content}></div>
      </div>
    </>
  );
};

export default UserPage;
