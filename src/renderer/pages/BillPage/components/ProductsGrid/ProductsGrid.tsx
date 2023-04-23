import styles from './ProductsGrid.module.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, categoriesState, productsState, tokenState } from 'renderer/recoil/states';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { SearchProductOutput } from 'main/product/dtos/search-product.dto';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import ProductCategory from './ProductCategory';
import ProductBoxes from './ProductBoxes';
import { Pagination } from '@mui/material';

const ProductsGrid = () => {
  const [categories, setCategories] = useRecoilState(categoriesState)
  const [products, setProducts] = useRecoilState(productsState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState)
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState<number>(1);


  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      business: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-categories',
      ({ ok, error, categories }: GetCategoriesOutput) => {
        if (ok) {
          setCategories(categories);
        } else if (error) {
          console.error(error);
        }
      }
    );
  }, [])

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
        <ProductCategory categories={categories} page={page} token={token} business={business} />
        <div style={{ margin: '20px', height: '300px' }}>
          <ProductBoxes products={products} page={page} />
        </div>
        <div style={{ margin: '0 auto' }}>
          <Pagination
            count={LAST_PAGE}
            size="small"
            color="standard"
            defaultPage={1}
            boundaryCount={1}
            onChange={(event) => handlePage(event, page + '1')}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsGrid;
