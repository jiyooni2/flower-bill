import React, { useEffect, useState } from 'react';
import { Typography, Autocomplete, TextField } from '@mui/material';
import CreateCategoryModal from './components/CreateCategoryModal/CreateCategoryModal';
import CategoryField from './components/CategoryField/CategoryField';
import styles from './CategoryPage.module.scss';

// type of data
interface RenderTree {
  id: string;
  category: string;
  name: string;
  children: RenderTree[];
}

const data: RenderTree[] = [
  // DUMMY DATA
  {
    id: '1',
    category: 'Main',
    name: '꽃',
    children: [
      {
        id: '2',
        category: 'Sub',
        name: '진달래',
        children: [
          {
            id: '3',
            category: 'Group',
            name: '철쭉',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: '5',
    category: 'Main',
    name: '나무',
    children: [],
  },
];


const CategoryPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dataNames] = useState<string[]>([]);
  const [dataSet, setDataSet] = useState<RenderTree[]>(data);

  useEffect(() => {
    dataSet.map((mains) => {
      mains.children.map((subs) => {
        subs.children.map((groups) => {
          dataNames.push(mains.name);
          dataNames.push(subs.name);
          dataNames.push(groups.name);
        });
      });
    });
  }, [dataSet]);

  return (
    <>
      <CreateCategoryModal isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
      <div className={styles.header}>
        <div>
          <Autocomplete
            autoHighlight
            id="search-categories"
            size="small"
            options={dataNames}
            sx={{ width: 300, marginLeft: '5%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="상품 검색.."
                InputLabelProps={{ className: styles.searchText }}
              />
            )}
          />
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.category_container}></div>
        <div className={styles.detail_container}>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '4%',
              fontSize: '27px',
            }}
          >
            카테고리 관리
          </Typography>
          <button
            className={styles.createBtn}
            // onClick={() => {
            //   return setIsOpen(true);
            // }}
          >
            생성
          </button>
          <button className={styles.deleteBtn}>삭제</button>
          <CategoryField data={data} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
