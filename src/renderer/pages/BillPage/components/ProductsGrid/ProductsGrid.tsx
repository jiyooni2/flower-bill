import { Product } from 'main/product/entities/product.entity';
import styles from './ProductsGrid.module.scss';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import ProductBox from '../ProductBox/ProductBox';
import { useEffect, useState } from 'react';
import MemoModal from '../MemoModal/MemoModal';
import { useRecoilState } from 'recoil';
import { productsState } from 'renderer/recoil/states';
// 카테고리 데이터 가져오기
// import { useRecoilState } from 'recoil';
// import { categoryState } from 'renderer/recoil/states';

interface RenderTree {
  id: string;
  category: string;
  name: string;
  children: RenderTree[];
}

const catdata = [
  // DUMMY DATA
  {
    id: '1',
    category: 'Main',
    name: '꽃',
    children: [
      {
        id: '2',
        category: 'Sub',
        name: '진달래',
        children: [
          {
            id: '3',
            category: 'Group',
            name: '철쭉',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: '5',
    category: 'Main',
    name: '나무',
    children: [],
  },
];

const ProductsGrid = () => {
  // const [categories, setCategories] = useRecoilState(categoryState);  // 카테고리 데이터 가져오기
  const [products, setProducts] = useRecoilState(productsState);
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState<number>(1);
  const [mainCat, setMainCat] = useState<RenderTree>();
  const [subCat, setSubCat] = useState<RenderTree>();
  // const [categoryData, setCategoryData] = useState(products);
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);

  useEffect(() => {
    setProducts(products)
  }, [])

  const handlePage = (event: any) => {
    const pageNow = parseInt(event.target.outerText);
    setPage(pageNow);
  };

  const LAST_PAGE =
    products.length % 9 === 0
      ? Math.round(products.length / 9)
      : Math.floor(products.length / 9) + 1;


  const handleClick = (data: RenderTree, name: string) => {
    if (name === 'main') setMainCat(data)
    else if (name === 'subs') setSubCat(data)

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
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = products.filter((product) => {
        return product.name
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
      });
      setProducts(results);
    } else {
      setProducts(products);
    }

    setSearchWord(keyword);
  };

  return (
    <>
      <MemoModal isOpen={isMemoOpen} setIsOpen={setIsMemoOpen} />
      <div
        className={`${styles.content_container} ${styles.products_container}`}
      >
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            onClick={() => setIsMemoOpen(true)}
            className={styles.memoBtn}
          >
            메모
          </Button>
          <input
            type="text"
            className={styles.searchProduct}
            placeholder="상품 검색"
            value={searchWord}
            onChange={searchFilterHandler}
          />
        </div>

        <Box sx={{ width: '23rem', marginLeft: '20px', marginBottom: '25px' }}>
          <FormControl size="small" sx={{ width: '30%', marginRight: '15px' }}>
            <InputLabel>대분류</InputLabel>
            <Select label="대분류" defaultValue="">
              {catdata.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item.name}
                  onClick={() => handleClick(item, 'main')}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: '30%', marginRight: '15px' }}>
            <InputLabel>중분류</InputLabel>
            <Select label="중분류" defaultValue="">
              {mainCat?.children.map((subs) => (
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
              {subCat?.children.map((groups) => (
                <MenuItem
                  key={groups.id}
                  value={groups.name}
                  onClick={() => handleClick(groups, 'groups')}
                >
                  {groups.name}
                </MenuItem>
              ))}
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
              {Array.from(products).slice((page - 1) * 9, page * 9).map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={4} xl={2}>
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
