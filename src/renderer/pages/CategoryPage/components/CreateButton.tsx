import { Button } from '@mui/material';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from 'main/category/dtos/create-category.dto';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { useRecoilValue } from 'recoil';
import {
  businessState,
  categoriesState,
  tokenState,
} from 'renderer/recoil/states';
import { CreateButtonProps } from '../CategoryPage.interface';
import { useEffect } from 'react';

const CreateButton = ({
  setAlert,
  setCategoryId,
  setCategoryName,
  setCategories,
  setLevelName,
  setParentCategoryName,
  alert,
  categoryName,
  parentCategoryId,
}: CreateButtonProps) => {
  const token = useRecoilValue(tokenState);
  const categories = useRecoilValue(categoriesState);
  const business = useRecoilValue(businessState);

  useEffect(() => {
    const getCategoriesRemover = window.electron.ipcRenderer.on(
      'get-categories',
      ({ ok, error, categories }: GetCategoriesOutput) => {
        if (ok) {
          setAlert({
            success: '카테고리가 생성되었습니다.',
            error: '',
          });
          setCategories(categories);
        } else {
          console.error(error);
        }
      }
    );

    const createCategoryRemover = window.electron.ipcRenderer.on(
      'create-category',
      ({ ok, error }: CreateCategoryOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-categories', {
            token,
            businessId: business.id,
          });
        } else if (error) {
          console.log(error);
          setAlert({ success: '', error });
        }
      }
    );

    return () => {
      getCategoriesRemover();
      createCategoryRemover();
    };
  }, []);

  const newCategoryHandler = () => {
    if (!categoryName) {
      setAlert({ success: '', error: '카테고리명이 입력되지 않았습니다.' });
      return;
    }

    if (
      categories.findIndex(
        (el) =>
          el.name === categoryName && el.parentCategoryId === parentCategoryId
      ) > -1
    ) {
      setAlert({
        success: '',
        error: '동일한 부모 카테고리를 가진 카테고리가 있습니다.',
      });
      return;
    }

    if (!alert.error) {
      const newData: CreateCategoryInput = {
        token: token,
        businessId: business.id,
        name: categoryName,
        parentCategoryId: parentCategoryId,
      };
      window.electron.ipcRenderer.sendMessage('create-category', newData);
    }
    setCategoryId('');
    setCategoryName('');
    setLevelName('');
    setParentCategoryName('');
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ marginRight: '10px', marginTop: '-30px' }}
      onClick={newCategoryHandler}
    >
      생성
    </Button>
  );
};

export default CreateButton;
