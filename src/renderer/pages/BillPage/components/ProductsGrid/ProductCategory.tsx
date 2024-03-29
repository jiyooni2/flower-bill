import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Box } from '@mui/system';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import {
  GetProductByCategoryInput,
  GetProductByCategoryOutput,
} from 'main/product/dtos/get-product-by-category.dto';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  businessState,
  categoriesState,
  productsState,
  tokenState,
} from 'renderer/recoil/states';
import styles from './ProductsGrid.module.scss';

type IProps = {
  page: number;
};

const ProductCategory = ({ page }: IProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const setProducts = useSetRecoilState(productsState);
  const [mainId, setMainId] = useState<number>(0);
  const [mainName, setMainName] = useState<string>('');
  const [subId, setSubId] = useState<number>(0);
  const [subName, setSubName] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });
    const getCategoryRemover = window.electron.ipcRenderer.on(
      'get-categories',
      ({ ok, error, categories }: GetCategoriesOutput) => {
        if (ok) {
          setCategories(categories);
        } else if (error) {
          console.error(error);
        }
      }
    );

    const getProductByCategoryRemover = window.electron.ipcRenderer.on(
      'get-product-by-category',
      ({ ok, error, products }: GetProductByCategoryOutput) => {
        if (ok) {
          setProducts(products);
        } else if (error) {
          console.error(error);
        }
      }
    );

    return () => {
      getCategoryRemover();
      getProductByCategoryRemover();
    };
  }, []);

  const changeHandler = (e: SelectChangeEvent<string>, dataName: string) => {
    if (dataName === 'main') setMainName(e.target.value as string);
    else if (dataName === 'sub') setSubName(e.target.value as string);
    else if (dataName === 'group') setGroupName(e.target.value as string);
  };

  const categoryChangeHandler = (id: number, dataName: string) => {
    if (dataName === 'main') {
      setMainId(id);
      setGroupName('none');
    } else if (dataName === 'sub') {
      setSubId(id);
    }

    const data: GetProductByCategoryInput = {
      token,
      businessId: business.id,
      categoryId: id,
      page: page - 1,
    };

    window.electron.ipcRenderer.sendMessage('get-product-by-category', data);
  };

  return (
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
          <InputLabel id="main" style={{ marginTop: '-7px' }}>
            대분류
          </InputLabel>
          <Select
            labelId="main"
            value={mainName}
            label="대분류"
            size="small"
            onChange={(event) => changeHandler(event, 'main')}
            defaultValue={'none'}
          >
            <MenuItem value={'none'}>---------------</MenuItem>
            {categories != undefined &&
              categories.map((item) => {
                if (item.level === 1) {
                  return (
                    <MenuItem
                      key={item.id}
                      value={item.name == null ? '' : item?.name}
                      onClick={() => categoryChangeHandler(item.id, 'main')}
                    >
                      {item.name == null ? '' : item?.name}
                    </MenuItem>
                  );
                }
              })}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: '27%' }}>
        <FormControl fullWidth>
          <InputLabel id="sub" style={{ marginTop: '-7px' }}>
            중분류
          </InputLabel>
          <Select
            labelId="sub"
            value={subName}
            size="small"
            label="중분류"
            onChange={(event) => changeHandler(event, 'sub')}
            defaultValue={'none'}
            className={styles.selects}
          >
            <MenuItem value={'none'}>---------------</MenuItem>
            {categories != undefined &&
              categories.map((item) => {
                if (item.level === 2 && item.parentCategoryId === mainId) {
                  return (
                    <MenuItem
                      key={item.id}
                      value={item.name == null ? '' : item?.name}
                      onClick={() => categoryChangeHandler(item.id, 'sub')}
                    >
                      {item.name == null ? '' : item?.name}
                    </MenuItem>
                  );
                }
              })}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: '27%' }}>
        <FormControl fullWidth>
          <InputLabel id="sub" style={{ marginTop: '-7px' }}>
            소분류
          </InputLabel>
          <Select
            labelId="group"
            value={groupName}
            size="small"
            label="소분류"
            onChange={(event) => changeHandler(event, 'group')}
            defaultValue={'none'}
            className={styles.selects}
          >
            <MenuItem value={'none'}>---------------</MenuItem>
            {categories != undefined &&
              categories?.map((item) => {
                if (item.level === 3 && item.parentCategoryId === subId) {
                  return (
                    <MenuItem
                      key={item.id}
                      value={item.name == null ? '' : item?.name}
                      onClick={() => categoryChangeHandler(item.id, 'group')}
                    >
                      {item.name == null ? '' : item?.name}
                    </MenuItem>
                  );
                }
              })}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};

export default ProductCategory;
