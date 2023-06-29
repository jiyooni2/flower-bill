import { Button } from '@mui/material';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from 'main/category/dtos/update-category.dto';
import { useRecoilValue } from 'recoil';
import { businessState, tokenState } from 'renderer/recoil/states';
import { UpdateButtonProps } from '../CategoryPage.interface';

const UpdateButton = ({
  setAlert,
  categoryName,
  categoryId,
  setCategories,
  setCategoryId,
  setCategoryName,
  setLevelName,
  disable,
}: UpdateButtonProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);

  const updateHandler = () => {
    const updateData: UpdateCategoryInput = {
      name: categoryName,
      id: parseInt(categoryId),
      businessId: business.id,
      token,
    };

    window.electron.ipcRenderer.sendMessage('update-category', updateData);

    const updateCategoryRemover = window.electron.ipcRenderer.on(
      'update-category',
      ({ ok, error }: UpdateCategoryOutput) => {
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
                  success: '카테고리가 수정되었습니다.',
                  error: '',
                });
                setCategories(categories);
                setCategoryId('');
                setCategoryName('');
                setLevelName('');
                getCategoriesRemover();
              } else {
                console.error(error);
              }
            }
          );
          updateCategoryRemover();
        } else if (error) {
          console.log(error);
          setAlert({ success: '', error: `네트워크 ${error}` });
        }
      }
    );
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ marginRight: '10px', backgroundColor: 'coral' }}
      onClick={updateHandler}
      disabled={disable}
    >
      수정
    </Button>
  );
};

export default UpdateButton;
