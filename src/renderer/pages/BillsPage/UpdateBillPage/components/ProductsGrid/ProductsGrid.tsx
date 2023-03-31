import styles from './ProductsGrid.module.scss';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent } from '@mui/material';
import ProductBox from '../ProductBox/ProductBox';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { billState, businessState, categoriesState, productsState, tokenState } from 'renderer/recoil/states';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { SearchProductOutput } from 'main/product/dtos/search-product.dto';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { GetProductByCategoryInput, GetProductByCategoryOutput } from 'main/product/dtos/get-product-by-category.dto';
import { BillResult } from 'main/common/dtos/bill-result.dto';
import { Link } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';


const ProductsGrid = () => {
  const [categories, setCategories] = useRecoilState(categoriesState)
  const [products, setProducts] = useRecoilState(productsState);
  // const [orderProduct, setOrderProduct] = useState<
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState)
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState<number>(1);
  const [mainId, setMainId] = useState<number>(0);
  const [mainName, setMainName] = useState<string>('');
  const [subId, setSubId] = useState<number>(0);
  const [subName, setSubName] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const currentBill = useRecoilValue(billState);
  const [orderProduct, setOrderProduct] = useState<BillResult>()

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

    setOrderProduct(currentBill);
  }, [])

  const handlePage = (event: any) => {
    const pageNow = parseInt(event.target.outerText);
    setPage(pageNow);
  };

  let LAST_PAGE = 1;
  if (products != undefined) {
    products.length % 9 === 0
      ? Math.round(products.length / 9)
      : Math.floor(products.length / 9) + 1;
  } else if (products == null) {
    LAST_PAGE = 1;
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
              console.log(products)
              setProducts(products);
            } else if (error) {
              console.error(error);
            }
          }
        );
      }
    }
  };

  const changeHandler = (e: SelectChangeEvent<unknown>, dataName: string) => {
    if (dataName === 'main') setMainName(e.target.value as string);
    else if (dataName === 'sub') setSubName(e.target.value as string);
    else if (dataName === 'group') setGroupName(e.target.value as string);
  };


  const categoryChangeHandler = (id: number, dataName: string) => {
    if (dataName === 'main') {
      setMainId(id);
      setGroupName('none');
    } else if (dataName === 'sub'){
      setSubId(id);
    }

    const data: GetProductByCategoryInput = {
      token,
      businessId: business.id,
      categoryId: id,
      page: page - 1,
    };

    window.electron.ipcRenderer.sendMessage('get-product-by-category', data);
    window.electron.ipcRenderer.on(
      'get-product-by-category',
      ({ ok, error, products }: GetProductByCategoryOutput) => {
        if (ok) {
          setProducts(products);
        } else if (error) {
          console.error(error);
        }
      }
    );
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            gap: '5%',
          }}
        >
          <Box sx={{ width: '27%' }}>
            <FormControl fullWidth>
              <InputLabel id="main">대분류</InputLabel>
              <Select
                labelId="main"
                value={mainName}
                label="대분류"
                onChange={(event) => changeHandler(event, 'main')}
                defaultValue={'none'}
                className={styles.selects}
              >
                <MenuItem value={'none'}>---------------</MenuItem>
                {categories.map((item) => {
                  if (item.level === 1) {
                    return (
                      <MenuItem
                        key={item.id}
                        value={item.name}
                        onClick={() => categoryChangeHandler(item.id, 'main')}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '27%' }}>
            <FormControl fullWidth>
              <InputLabel id="sub">중분류</InputLabel>
              <Select
                labelId="sub"
                value={subName}
                label="중분류"
                onChange={(event) => changeHandler(event, 'sub')}
                defaultValue={'none'}
                className={styles.selects}
              >
                <MenuItem value={'none'}>---------------</MenuItem>
                {categories.map((item) => {
                  if (item.level === 2 && item.parentCategoryId === mainId) {
                    return (
                      <MenuItem
                        key={item.id}
                        value={item.name}
                        onClick={() => categoryChangeHandler(item.id, 'sub')}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '27%' }}>
            <FormControl fullWidth>
              <InputLabel id="sub">소분류</InputLabel>
              <Select
                labelId="group"
                value={groupName}
                label="소분류"
                onChange={(event) => changeHandler(event, 'group')}
                defaultValue={'none'}
                className={styles.selects}
              >
                <MenuItem value={'none'}>---------------</MenuItem>
                {categories.map((item) => {
                  if (item.level === 3 && item.parentCategoryId === subId) {
                    return (
                      <MenuItem
                        key={item.id}
                        value={item.name}
                        onClick={() => categoryChangeHandler(item.id, 'group')}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </FormControl>
          </Box>
        </div>

        <div style={{ margin: '20px', height: '300px' }}>
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
                <Button variant="text" color="success">
                  상품 추가하러 가기{' '}
                  <ArrowForward sx={{ fontSize: '15px' }} />
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
            onChange={(event) => handlePage(event)}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsGrid;
