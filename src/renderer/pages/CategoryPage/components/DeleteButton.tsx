import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { DeleteCategoryOutput } from 'main/category/dtos/delete-category.dto';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { useRecoilValue } from 'recoil';
import { businessState, tokenState } from 'renderer/recoil/states';
import { DeleteButtonProps } from '../CategoryPage.interface';
import { useEffect } from 'react';

const DeleteButton = ({
  clicked,
  categoryId,
  setAlert,
  setCategories,
  setCategoryId,
  setCategoryName,
  setLevelName,
}: DeleteButtonProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);

  useEffect(() => {
    const getCategoriesRemover = window.electron.ipcRenderer.on(
      'get-categories',
      ({ ok, error, categories }: GetCategoriesOutput) => {
        if (ok) {
          setCategories(categories);
          setCategoryId('');
          setCategoryName('');
          setLevelName('');
        } else {
          console.error(error);
        }
      }
    );

    const deleteCategoryRemover = window.electron.ipcRenderer.on(
      'delete-category',
      ({ ok, error }: DeleteCategoryOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-categories', {
            token,
            businessId: business.id,
          });

          setAlert({
            success: '카테고리가 삭제되었습니다.',
            error: '',
          });
        } else if (error) {
          console.error(error);
          setAlert({ success: '', error });
        }
      }
    );

    return () => {
      getCategoriesRemover();
      deleteCategoryRemover();
    };
  }, []);

  const deleteHandler = () => {
    window.electron.ipcRenderer.sendMessage('delete-category', {
      businessId: business.id,
      id: categoryId,
      token,
    });
  };

  return (
    <>
      {clicked ? (
        <Button
          variant="contained"
          size="small"
          sx={{ marginLeft: '30px' }}
          color="error"
          onClick={() => deleteHandler()}
        >
          <Delete sx={{ fontSize: '23px' }} />
        </Button>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default DeleteButton;
