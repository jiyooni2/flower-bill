import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { DeleteCategoryOutput } from 'main/category/dtos/delete-category.dto';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { useRecoilValue } from 'recoil';
import { businessState, tokenState } from 'renderer/recoil/states';
import { DeleteButtonProps } from '../CategoryPage.interface';

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

  const deleteHandler = () => {
    window.electron.ipcRenderer.sendMessage('delete-category', {
      businessId: business.id,
      id: categoryId,
      token,
    });

    const deleteCategoryRemover = window.electron.ipcRenderer.on(
      'delete-category',
      ({ ok, error }: DeleteCategoryOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-categories', {
            token,
            businessId: business.id,
          });
          const getCategoriesRemover = window.electron.ipcRenderer.on(
            'get-categories',
            ({ ok, error, categories }: GetCategoriesOutput) => {
              if (ok) {
                setAlert({
                  success: '카테고리가 삭제되었습니다.',
                  error: '',
                });
                setCategories(categories);
                setCategoryId('');
                setCategoryName('');
                setLevelName('');
              } else {
                console.error(error);
              }
            }
          );
        } else if (error) {
          console.log(error);
          if (error.startsWith('카테고리에 속해있는')) {
            setAlert({ success: '', error: error.split('. ')[1] });
          }
        }
      }
    );
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
