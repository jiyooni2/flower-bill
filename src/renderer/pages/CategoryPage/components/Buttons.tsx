import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import InfoModal from 'renderer/components/InfoModal/InfoModal';
import {
  businessState,
  categoriesState,
  tokenState,
} from 'renderer/recoil/states';
import CreateButton from './CreateButton';
import DeleteButton from './DeleteButton';
import UpdateButton from './UpdateButton';
import { ButtonsProps } from '../CategoryPage.interface';

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
}: ButtonsProps) => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });
    const getCategoriesRemover = window.electron.ipcRenderer.on(
      'get-categories',
      ({ ok, error, categories }: GetCategoriesOutput) => {
        if (ok) {
          setCategories(categories);
        } else {
          console.error(error);
          setAlert({ success: '', error: error });
        }
      }
    );

    return () => {
      getCategoriesRemover();
    };
  }, []);

  useEffect(() => {
    const idx = categories.findIndex((el) => el.id === Number(categoryId));
    if (categories[idx]?.name === categoryName || categoryName === '') {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [categoryName]);

  return (
    <>
      <InfoModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        text="이 기능은 현재 개발중입니다."
      />
      <DeleteButton
        clicked={clicked}
        categoryId={categoryId}
        setAlert={setAlert}
        setCategoryId={setCategoryId}
        setCategoryName={setCategoryName}
        setCategories={setCategories}
        setLevelName={setLevelName}
      />
      {!clicked ? (
        <CreateButton
          setAlert={setAlert}
          setCategoryId={setCategoryId}
          setCategoryName={setCategoryName}
          setCategories={setCategories}
          setLevelName={setLevelName}
          setParentCategoryName={setParentCategoryName}
          alert={alert}
          categoryName={categoryName}
          parentCategoryId={parentCategoryId}
        />
      ) : (
        <UpdateButton
          setAlert={setAlert}
          categoryName={categoryName}
          categoryId={categoryId}
          setCategories={setCategories}
          setCategoryId={setCategoryId}
          setCategoryName={setCategoryName}
          setLevelName={setLevelName}
          disable={disable}
        />
      )}
    </>
  );
};

export default Buttons;
