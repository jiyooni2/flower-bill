import styles from './ProductsGrid.module.scss';
 import { Button, Grid, Pagination } from '@mui/material';
 import ProductBox from '../ProductBox/ProductBox';
 import { ChangeEvent, useEffect, useState } from 'react';
 import { useRecoilState, useRecoilValue } from 'recoil';
 import { businessState, productsState, tokenState } from 'renderer/recoil/states';
import { SearchProductOutput } from 'main/product/dtos/search-product.dto';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProductCategory from './ProductCategory';
const ProductsGrid = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState)
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState<number>(1);


   useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-products',
      ({ ok, error, products }: GetProductsOutput) => {
        if (ok) {
          setProducts(products);
        }
        if (error) {
          console.error(error);
        }
      }
    );
  }, []);

   const handlePage = (event: ChangeEvent<unknown>, value: string) => {
     const pageNow = parseInt(value);
     setPage(pageNow);
   };

  let LAST_PAGE = 0;
  if (products != undefined || products) {
    LAST_PAGE = products.length % 9 === 0
      ? Math.round(products.length / 9)
      : Math.floor(products.length / 9) + 1;
  } else if (products == null) {
    LAST_PAGE = 0;
  }
  const filterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };
  const searchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.nativeEvent.isComposing === false) {
      if (searchWord == '') {
        window.electron.ipcRenderer.sendMessage('get-products', {
          token,
          business: business.id,
        });
        window.electron.ipcRenderer.on(
          'get-products',
          ({ ok, error, products }: GetProductsOutput) => {
            if (ok) {
              setProducts(products);
            } else if (error) {
              console.error(error);
            }
          }
        );
      } else {
        window.electron.ipcRenderer.sendMessage('search-product', {
          keyword: searchWord,
          page: page - 1,
          token,
          businessId: business.id,
        });
        window.electron.ipcRenderer.on(
          'search-product',
          ({ ok, error, products }: SearchProductOutput) => {
            if (ok) {
              setProducts(products);
            } else if (error) {
              console.error(error);
            }
          }
        );
      }
    }
  };

  return (
    <>
      <div
        className={`${styles.content_container} ${styles.products_container}`}
      >
        <div
          style={{
            margin: '20px',
            float: 'right',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'right',
          }}
        >
          <input
            type="text"
            className={styles.searchProduct}
            placeholder="상품 검색"
            value={searchWord}
            onChange={filterHandler}
            onKeyDown={searchHandler}
          />
        </div>
          <ProductCategory page={page} />
        <div style={{ margin: '20px', height: '50vh' }}>
          {products && (
            <Grid
              container
              spacing={{ xs: 1, md: 2 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{ marginLeft: '5px', height: '200px', marginBottom: '30px' }}
            >
              {Array.from(products)
                .slice((page - 1) * 9, page * 9)
                .map((product) => (
                  <Grid
                    item
                    key={product.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                  >
                    <ProductBox product={product} />
                  </Grid>
                ))}
            </Grid>
          )}
          {(products != undefined && products?.length == 0 && (
            <div>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '-38%',
                  fontSize: '14px',
                  color: 'dimgray',
                }}
              >
                상품이 없습니다.
              </span>
              <Link
                to={'/products'}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '5px',
                  fontSize: '13px',
                  color: 'darkslateblue',
                  marginLeft: '2px',
                }}
              >
                <Button variant="text" sx={{ color: '#2DCDDF' }}>
                  상품 추가하러 가기{' '}
                  <ArrowForwardIcon sx={{ fontSize: '15px' }} />
                </Button>
              </Link>
            </div>
          )) ||
            ''}
        </div>
        <div style={{ margin: '0 auto' }}>
          <Pagination
            count={LAST_PAGE}
            size="small"
            color="standard"
            defaultPage={1}
            boundaryCount={1}
            onChange={(event) => handlePage(event, (page + 1).toString())}
          />
        </div>
      </div>
    </>
  );
};
export default ProductsGrid;
