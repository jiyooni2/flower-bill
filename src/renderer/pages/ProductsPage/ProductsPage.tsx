import { ChangeEvent, useEffect, useState } from 'react';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { Pagination } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  businessState,
  categoriesState,
  tokenState,
} from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import styles from './ProductsPage.module.scss';
import { Category } from 'main/category/entities/category.entity';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { SearchProductInput, SearchProductOutput } from 'main/product/dtos/search-product.dto';
import ProductTable from './components/ProductTable';
import ProductInputs from './components/ProductInputs';
import { Error, Input } from './types';


const ProductsPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>(null);
  const [inputs, setInputs] = useState<Input>({
    id: 0,
    name: '',
    price: '',
    keyword: '',
    categoryName: '',
    clicked: false,
    favorite: false,
    page: 1,
  })
  const [errors, setErrors] = useState<Error>({
    name: '',
    price: '',
    category: '',
  });


  useEffect(() => {
    categories.map((cat) => {
      if (cat.id == categoryId) {
        return setInputs({...inputs, categoryName: cat?.name})
      }
    });
  }, [categoryId])


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

    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-categories',
      (args: GetCategoriesOutput) => {
        setCategories(args.categories as Category[]);
      }
    );
  }, []);


  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({...inputs, keyword: e.target.value})
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      if (inputs.keyword != '') {
        const searchData: SearchProductInput = {
          token,
          businessId: business.id,
          keyword: inputs.keyword,
          page: inputs.page - 1,
        };

        window.electron.ipcRenderer.sendMessage('search-product', searchData);
        window.electron.ipcRenderer.on(
          'search-product',
          ({ ok, error, products }: SearchProductOutput) => {
            if (ok) {
              setProducts(products);
            } else {
              console.log(error);
            }
          }
        );
      } else {
        window.electron.ipcRenderer.sendMessage('get-products', {
          token,
          businessId: business.id,
        });
        window.electron.ipcRenderer.on(
          'get-products',
          (args: GetProductsOutput) => {
            setProducts(args.products as Product[]);
          }
        );
      }
    }
    clearInputs();
  };


  const clearInputs = () => {
    setInputs({...inputs, clicked: false, name: '', price: ''})
    setCategoryId(0);
    setErrors({ name: '', price: '', category: '' });
  };


  let LAST_PAGE = 1;
  if (products != undefined) {
    LAST_PAGE = products?.length % 9 === 0
      ? Math.round(products?.length / 9)
      : Math.floor(products?.length / 9) + 1;
  } else if (products == null) {
    LAST_PAGE = 1;
  }

  const handlePage = (event: ChangeEvent<unknown>, value: number) => {
    setInputs({...inputs, page: value})
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <input
            type="search"
            value={inputs.keyword}
            onChange={filter}
            placeholder="상품 검색"
            className={styles.searchInput}
            onKeyDown={keyHandler}
          />
          <div className={styles.userList}>
            <ProductTable
              products={products}
              categories={categories}
              inputs={inputs}
              setInputs={setInputs}
              setId={setCategoryId}
            />
          </div>
          <div className={styles.pagination}>
            <Pagination
              count={LAST_PAGE}
              size="small"
              color="standard"
              onChange={handlePage}
            />
          </div>
        </div>
        <div>
          <ProductInputs
            inputs={inputs}
            setInputs={setInputs}
            errors={errors}
            setErrors={setErrors}
            id={categoryId}
            setCategoryId={setCategoryId}
            setProducts={setProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
