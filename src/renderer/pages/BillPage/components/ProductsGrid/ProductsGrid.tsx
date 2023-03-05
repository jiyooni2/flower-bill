import styles from './ProductsGrid.module.scss';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import ProductBox from '../ProductBox/ProductBox';
import { useEffect, useState } from 'react';
import MemoModal from '../MemoModal/MemoModal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, categoriesState, categoryState, productsState, tokenState } from 'renderer/recoil/states';
import { Category } from 'main/category/entities/category.entity';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { SearchProductOutput } from 'main/product/dtos/search-product.dto';


const ProductsGrid = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);  // 카테고리 데이터 가져오기
  const [products, setProducts] = useRecoilState(productsState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState)
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState<number>(1);
  const [mainCat, setMainCat] = useState<Category>();
  const [subCat, setSubCat] = useState<Category>();

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
          window.alert(error);
        }
      }
    );
  }, [])

  const handlePage = (event: any) => {
    const pageNow = parseInt(event.target.outerText);
    setPage(pageNow);
  };

  const LAST_PAGE =
    products.length % 9 === 0
      ? Math.round(products.length / 9)
      : Math.floor(products.length / 9) + 1;


  const handleClick = (data: Category, name: string) => {
    if (name === 'main') setMainCat(data);
    else if (name === 'subs') setSubCat(data);

    // if (mainCat || subCat){
    //   const results = products.filter((product) => {
    //     if (
    //       product.categoryId.toString() === mainCat?.id ||
    //       product.categoryId.toString() === subCat?.id
    //     )
    //       return product;
    //   });
    //   setProducts(results);
    // } else {
    //   setProducts(products)
    // }
  };

  const searchFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  }

  const searchHandler = () => {
    window.electron.ipcRenderer.sendMessage('search-product', {
      searchWord,
      token,
      businessId: business.id,
      page: 1,
    });

    window.electron.ipcRenderer.on(
      'search-product',
      ({ ok, error, products }: SearchProductOutput) => {
        if (ok) {
          setProducts(products);
        } else {
          console.log(error)
          alert(error);
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
            justifyContent: 'right'
          }}
        >
          <input
            type="text"
            className={styles.searchProduct}
            placeholder="상품 검색"
            value={searchWord}
            onChange={searchFilterHandler}
          />
          <Button size='small' sx={{ height: '35px', width: '70px', marginTop: '25px', right: 0}} onClick={searchHandler}>검색</Button>
        </div>
        <Box sx={{ width: '95%', display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
          <FormControl size="small" sx={{ width: '30%', marginRight: '15px' }}>
            <InputLabel>대분류</InputLabel>
            <Select label="대분류" defaultValue="">
              {categories.map((item) => {
                if (item.level === 1) {
                  return (
                    <MenuItem
                      key={item.id}
                      value={item.name}
                      onClick={() => handleClick(item, 'main')}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: '30%', marginRight: '15px' }}>
            <InputLabel>중분류</InputLabel>
            <Select label="중분류" defaultValue="">
              {mainCat &&
                mainCat.childCategories.map((subs) => (
                  <MenuItem
                    key={subs.id}
                    value={subs.name}
                    onClick={() => handleClick(subs, 'subs')}
                  >
                    {subs.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: '30%' }}>
            <InputLabel>소분류</InputLabel>
            <Select label="소분류" defaultValue="">
              {/* {subCat ? (
                subCat.childCategories.map((groups) => (
                  <MenuItem
                    key={groups.id}
                    value={groups.name}
                    onClick={() => handleClick(groups, 'groups')}
                  >
                    {groups.name}
                  </MenuItem>
                ))
                ) : (
                  <MenuItem
                    // value={groups.name}
                    // onClick={() => handleClick(groups, 'groups')}
                  >
                    {/* {groups.name}
                  </MenuItem>
                )
              } */}
            </Select>
          </FormControl>
        </Box>

        <div style={{ margin: '20px' }}>
          {products ? (
            <Grid
              container
              spacing={{ xs: 1, md: 2 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{ marginLeft: '5px', height: '300px', marginBottom: '30px' }}
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
          ) : (
            <div>데이터를 가져오고 있습니다.</div>
          )}
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
