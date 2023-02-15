import { Product } from 'main/product/entities/product.entity';
import styles from './ProductsGrid.module.scss';
import { Box, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import ProductBox from '../ProductBox/ProductBox';
import { useEffect, useState } from 'react';
// 카테고리 데이터 가져오기
// import { useRecoilState } from 'recoil';
// import { categoryState } from 'renderer/recoil/states';

interface RenderTree {
  id: string;
  category: string;
  name: string;
  children: RenderTree[];
}

interface IProps {
  products: Product[];
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

const ProductsGrid = ({ products }: IProps) => {
  // const [categories, setCategories] = useRecoilState(categoryState);  // 카테고리 데이터 가져오기
  const [productData, setProductData] = useState(products);
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState<number>(1);
  const [mainCat, setMainCat] = useState<RenderTree>();
  const [subCat, setSubCat] = useState<RenderTree>();
  const [groupCat, setGroupCat] = useState<RenderTree>();

  useEffect(() => {
    setProductData(products)
  }, [])

  const handlePage = (event: any) => {
    const pageNow = parseInt(event.target.outerText);
    setPage(pageNow);
  };

  // console.log(productData)

  const LAST_PAGE =
    productData.length % 12 === 0
      ? Math.round(productData.length / 12)
      : Math.floor(productData.length / 12) + 1;


  const handleClick = (data: RenderTree, name: string) => {
    if (name === 'Main') setMainCat(data);
    else if (name === 'Sub') setSubCat(data);
    else if (name === 'Group') setGroupCat(data);

    // 여기부터
    // setProductData(
    //   productData.filter(
    //     (item) => {
    //       if (mainCat && subCat && groupCat) {
    //         groupCat?.id === item.categoryId.toString();
    //       } else if (mainCat && subCat && !groupCat){
    //         subCat?.id === item.categoryId.toString();
    //       } else if (mainCat && !subCat && !groupCat){
    //         mainCat?.id === item.categoryId.toString();
    //       }
    //     }
    //   ))
  };

  const searchFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = products.filter((product) => {
        return product.name
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
      });
      setProductData(results);
    } else {
      setProductData(products);
    }

    setSearchWord(keyword);
  };

  return (
    <div className={`${styles.content_container} ${styles.products_container}`}>
      <div>
        {/* <Typography
          variant="h5"
          align="center"
          marginTop="15px"
          marginBottom="20px"
        >
          상품
        </Typography> */}
        <input
          type="text"
          className={styles.searchProduct}
          placeholder="상품 검색"
          value={searchWord}
          onChange={searchFilterHandler}
        />
      </div>

      <Box sx={{ width: '95%', marginLeft: '20px', marginBottom: '20px' }}>
        <FormControl size="small" sx={{ width: '30%', marginRight: '15px' }}>
          <InputLabel>대분류</InputLabel>
          <Select label="대분류" defaultValue="">
            {catdata.map((item) => (
              <MenuItem
                key={item.id}
                value={item.name}
                onClick={() => handleClick(item, 'Main')}
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
                onClick={() => handleClick(subs, 'Sub')}
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
                onClick={() => handleClick(groups, 'Group')}
              >
                {groups.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <div style={{ margin: '5%' }}>
        {productData ? (
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ marginLeft: '5px' }}
          >
            {Array.from(productData).map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3} lg={3} xl={2}>
                <ProductBox product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <div>데이터를 가져오고 있습니다.</div>
        )}
      </div>
      <div style={{ margin: '30px auto' }}>
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
  );
};

export default ProductsGrid;
