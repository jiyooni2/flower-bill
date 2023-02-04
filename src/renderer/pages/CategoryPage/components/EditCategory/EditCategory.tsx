import React, { useState } from 'react';
// Styles
import styles from './EditCategory.module.scss';

//types
interface RenderTree {
  category: string;
  name: string;
  children: RenderTree[];
}

interface IProps {
  data: RenderTree;
}


const EditCategory = (props: IProps) => {
  const [categoryName, setCategoryName] = useState<string>(props.data.name);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();

      props.data.name = categoryName;

      setCategoryName('');
      setCanEdit(false);
    }
    return props.data;
  };

  const doubleClickHandler = () => {
    setCanEdit(true);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value);
  };

  return !canEdit ? (
    <input
      readOnly={true}
      type="text"
      className={styles.categoryInput}
      value={props.data.name}
      onDoubleClick={doubleClickHandler}
    />
  ) : (
    <input
      readOnly={false}
      type="text"
      className={styles.categoryInput}
      value={categoryName}
      onChange={changeHandler}
      onKeyDown={handleKeyPress}
    />
  );
};

export default EditCategory;
