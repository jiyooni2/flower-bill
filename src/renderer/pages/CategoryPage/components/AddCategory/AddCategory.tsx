import React, { useState } from 'react';
// Styles
import { TreeItem } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import styles from './AddCategory.module.scss';

// Type of Datas
interface RenderTree {
  category: string;
  name: string;
  children: RenderTree[];
}

interface IProps {
  label: string;
  data: RenderTree[];
  parentData: RenderTree; // 상위 데이터의 children data -> 즉 중분류 혹은 소분류
  passData(data: RenderTree[]): void;
}


const AddCategory = ({
  label,
  data,
  parentData,
  passData,
}: IProps) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [categoryValue, setCategoryValue] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');

  // console.log(data)

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();

      if (label === '대분류') {
        setCategoryName('Main');
      } else if (label === '중분류') {
        setCategoryName('Sub');
      } else if (label === '소분류') {
        setCategoryName('Group');
      }

      const newCategoryData = {
        id: Math.random().toString(16).slice(2),
        category: categoryName,
        name: categoryValue,
        children: [],
      };

      if (label === '소분류') {
        if (parentData.children) {
          parentData.children.push(newCategoryData);
          passData(parentData.children);
        }
      } else if (label === '중분류') {
        if (parentData.children) {
          parentData.children.push(newCategoryData);
          passData(parentData.children);
        }
      } else if (label === '대분류') {
        data.push(newCategoryData);
        passData(data);
      }

      setCategoryValue('');
      setClicked(false);
    }
    return data;
  };

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryValue(event.target.value);
  };

  const labelClickHandler = () => {
    setClicked(true);
  };

  const labelChange = !clicked ? (
    <label className={styles.label} onClick={labelClickHandler}>
      {label} 추가하기
    </label>
  ) : (
    <input
      type="text"
      onKeyDown={handleKeyPress}
      onChange={valueChangeHandler}
      value={categoryValue}
      className={styles.categoryInput}
    />
  );

  return (
    <TreeItem
      nodeId={Math.random().toString(16).slice(2)}
      label={labelChange}
      endIcon={<AddIcon />}
      sx={{ margin: '1.5% 0' }}
    ></TreeItem>
  );
};

export default AddCategory;
