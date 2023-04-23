import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { CreateCategoryInput, CreateCategoryOutput } from 'main/category/dtos/create-category.dto';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import DevelopModal from 'renderer/components/DevelopModal/DevelopModal';
import { businessState, categoriesState, tokenState } from 'renderer/recoil/states';
import styles from '../CategoryPage.module.scss'
import { Inputs } from '../types';


type IProps = {
  setErrors: React.Dispatch<React.SetStateAction<{name: string}>>;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  inputs: Inputs;
}

const Buttons = ({ inputs, setErrors, setInputs  } : IProps) => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    setClicked(inputs.clicked);
  }, [])

  const newCategoryHandler = () => {
    if (inputs.categoryName === '') {
      setErrors({ name: '카테고리명이 입력되지 않았습니다.' });
      return;
    }

    const newData: CreateCategoryInput = {
      token: token,
      businessId: business.id,
      name: inputs.categoryName,
      parentCategoryId: inputs.parentCategoryId,
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
                setCategories(categories);
              } else {
                console.error(error);
              }
            }
          );
          console.log('done!');
        } else if (error) {
          console.log(error);
        }
      }
    );
    setInputs({...inputs, categoryId: '', categoryName: '', levelName: '', parentCategoryName: ''})
  };

  return (
    <>
      <DevelopModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.buttonList}>
        {inputs.clicked ? (
          <Button
            variant="contained"
            size="small"
            sx={{ marginLeft: '30px' }}
            color="error"
          >
            <Delete sx={{ fontSize: '23px' }} />
          </Button>
        ) : (
          <div></div>
        )}
        {!inputs.clicked ? (
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
            onClick={() => setIsOpen(true)}
          >
            수정
          </Button>
        )}
      </div>
    </>
  )
}

export default Buttons;
