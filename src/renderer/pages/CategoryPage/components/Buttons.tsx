import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from 'main/category/dtos/create-category.dto';
import {
  DeleteCategoryInput,
  DeleteCategoryOutput,
} from 'main/category/dtos/delete-category.dto';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from 'main/category/dtos/update-category.dto';
import { Category } from 'main/category/entities/category.entity';
import { CategoryResult } from 'main/common/dtos/category-result.dto';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import InfoModal from 'renderer/components/InfoModal/InfoModal';
import {
  businessState,
  categoriesState,
  productsState,
  tokenState,
} from 'renderer/recoil/states';

type IProps = {
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setLevelName: React.Dispatch<React.SetStateAction<string>>;
  setParentCategoryName: React.Dispatch<React.SetStateAction<string>>;
  categoryName: string;
  parentCategoryId: number;
  clicked: boolean;
  parentCategoryName: string;
  categoryId: string;
  alert: {
    success: string;
    error: string;
  };
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
};

const Buttons = ({
  categoryName,
  parentCategoryId,
  setCategoryId,
  categoryId,
  setCategoryName,
  setLevelName,
  setParentCategoryName,
  clicked,
  alert,
  setAlert,
}: IProps) => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const products = useRecoilValue(productsState);
  const [categoryResult, setCategoryResult] = useState<CategoryResult[]>(null);

  useEffect(() => setCategoryResult(categories), [categories]);

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
          if (error.startsWith('존재')) {
            setAlert({ success: '', error: error });
          } else {
            setAlert({ success: '', error: `네트워크 ${error}` });
          }
        }
      }
    );
  }, []);


  useEffect(() => {
    const idx = categories.findIndex((el) => el.id === Number(categoryId));
    if (categories[idx]?.name === categoryName || categoryName === '') {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [categoryName]);

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

      window.electron.ipcRenderer.on(
        'create-category',
        ({ ok, error }: CreateCategoryOutput) => {
          if (ok) {
            window.electron.ipcRenderer.sendMessage('get-categories', {
              token,
              businessId: business.id,
            });
            window.electron.ipcRenderer.on(
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
          } else if (error) {
            console.log(error);
            setAlert({ success: '', error: `네트워크 ${error}` });
          }
        }
      );
    }
    setCategoryId('');
    setCategoryName('');
    setLevelName('');
    setParentCategoryName('');
  };

  const updateHandler = () => {
    const updateData: UpdateCategoryInput = {
      name: categoryName,
      id: parseInt(categoryId),
      businessId: business.id,
      token,
    };

    window.electron.ipcRenderer.sendMessage('update-category', updateData);

    window.electron.ipcRenderer.on(
      'update-category',
      ({ ok, error }: UpdateCategoryOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-categories', {
            token,
            businessId: business.id,
          });
          window.electron.ipcRenderer.on(
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
              } else {
                console.error(error);
              }
            }
          );
        } else if (error) {
          console.log(error);
          setAlert({ success: '', error: `네트워크 ${error}` });
        }
      }
    );
  };




  return (
    <>
      <InfoModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        text="이 기능은 현재 개발중입니다."
      />
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
      {!clicked ? (
        <Button
          variant="contained"
          size="small"
          sx={{ marginRight: '10px', marginTop: '-30px' }}
          onClick={newCategoryHandler}
        >
          생성
        </Button>
      ) : (
        <Button
          variant="contained"
          size="small"
          sx={{ marginRight: '10px', backgroundColor: 'coral' }}
          onClick={updateHandler}
          disabled={disable}
        >
          수정
        </Button>
      )}
    </>
  );
};

export default Buttons;
