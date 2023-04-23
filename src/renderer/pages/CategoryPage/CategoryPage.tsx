import { useEffect, useRef, useState } from 'react';
import styles from './CategoryPage.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  businessState,
  categoriesState,
  tokenState,
} from 'renderer/recoil/states';
import { Typography } from '@mui/material';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import CategoryInput from './components/CategoryInput';
import { Inputs } from './types';
import CategoryTree from './components/CategoryTree';
import Buttons from './components/Buttons';



const CategoryPage = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [focused, setFocused] = useState<boolean>(false);
  const [inputs, setInputs] = useState<Inputs>({
    clicked: false,
    addNew: false,
    categoryId: '',
    categoryName: '',
    levelName: '',
    parentCategoryName: '',
    parentCategoryId: 0,
  })
  const [errors, setErrors] = useState({ name: '' });

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-categories',
      ({ ok, error, categories }: GetCategoriesOutput) => {
        if (ok) {
          setCategories(categories);
        } else {
          console.error(error);
        }
      }
    );
  }, []);


  return (
    <div className={styles.category}>
      <div className={styles.container}>
        <div className={styles.search}></div>
        <div className={styles.treeContainer}>
          <CategoryTree setInputs={setInputs} inputs={inputs} setFocused={setFocused} />
        </div>
      </div>
      <div style={{ width: '55%' }}>
        <div style={{ height: '100%' }}>
          <div className={styles.infoContent}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '24px',
                marginTop: '-10px',
              }}
            >
              카테고리 생성
            </Typography>
            <div className={styles.list}>
              <CategoryInput
                setInputs={setInputs}
                inputs={inputs}
                setErrors={setErrors}
                errors={errors}
                focused={focused}
              />
              <Buttons setErrors={setErrors} setInputs={setInputs} inputs={inputs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
