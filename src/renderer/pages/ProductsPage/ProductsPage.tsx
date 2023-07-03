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
import {
  SearchProductInput,
  SearchProductOutput,
} from 'main/product/dtos/search-product.dto';
import ProductTable from './components/ProductTable';
import ProductInputs from './components/ProductInputs';
import { Input } from './ProductsPage.interface';

const ProductsPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [clicked, setClicked] = useState<boolean>(false);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>(null);
  const [inputs, setInputs] = useState<Input>({
    clicked: false,
    id: 0,
    name: '',
    price: '',
    keyword: '',
    categoryName: '',
    favorite: false,
    page: 1,
  });

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });

    categories?.map((cat) => {
      if (cat.id == categoryId) {
        return setInputs({ ...inputs, categoryName: cat?.name });
      }
    });
  }, [categoryId]);

  useEffect(() => {
    const getProductsRemover = window.electron.ipcRenderer.on(
      'get-products',
      ({ ok, error, products }: GetProductsOutput) => {
        if (ok) {
          setProducts(products);
        } else if (error) {
          console.error(error);
        }
      }
    );

    const getCategoriesRemover = window.electron.ipcRenderer.on(
      'get-categories',
      (args: GetCategoriesOutput) => {
        setCategories(args.categories as Category[]);
      }
    );

    const searchProductRemover = window.electron.ipcRenderer.on(
      'search-product',
      ({ ok, error, products }: SearchProductOutput) => {
        if (ok) {
          setProducts(products);
        } else {
          console.log(error);
        }
      }
    );

    window.electron.ipcRenderer.sendMessage('get-products', {
      token,
      businessId: business.id,
    });

    return () => {
      getProductsRemover();
      getCategoriesRemover();
      searchProductRemover();
    };
  }, []);

  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, keyword: e.target.value });
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
      } else {
        window.electron.ipcRenderer.sendMessage('get-products', {
          token,
          businessId: business.id,
        });
      }
    }
    clearInputs();
  };

  const clearInputs = () => {
    setInputs({ ...inputs, name: '', price: '', clicked: false });
    setCategoryId(0);
  };

  let LAST_PAGE = 1;
  if (products != undefined) {
    LAST_PAGE =
      products?.length % 9 === 0
        ? Math.round(products?.length / 9)
        : Math.floor(products?.length / 9) + 1;
  } else if (products == null) {
    LAST_PAGE = 1;
  }

  const handlePage = (event: ChangeEvent<unknown>, value: number) => {
    setInputs({ ...inputs, page: value });
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
              setClicked={setClicked}
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
            id={categoryId}
            setCategoryId={setCategoryId}
            setProducts={setProducts}
            clicked={clicked}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
