import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, categoriesState, categoryIdState, tokenState } from 'renderer/recoil/states';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { Category } from 'main/category/entities/category.entity';
import styles from './CategoryModal.module.scss'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const CategoryModal = ({ isOpen, setIsOpen }: IProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [categories, setCategories] = useRecoilState(categoriesState)
  const [mainId, setMainId] = useState<number>(0);
  const [mainName, setMainName] = useState<string>('');
  const [subId, setSubId] = useState<number>(0);
  const [subName, setSubName] = useState<string>('');
  const [groupId, setGroupId] = useState<number>(0);
  const [groupName, setGroupName] = useState<string>('');
  const [categoryId, setCategoryId] = useRecoilState(categoryIdState)

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on('get-categories', (args: GetCategoriesOutput) => {
      setCategories(args.categories as Category[]);
    });
  }, []);

  const mainChangeHandler = (e: SelectChangeEvent<unknown>) => {
    setMainName(e.target.value as string);
  };
  const subChangeHandler = (e: SelectChangeEvent<unknown>) => {
    setSubName(e.target.value as string);
  };
  const groupChangeHandler = (e: SelectChangeEvent<unknown>) => {
    setGroupName(e.target.value as string);
  };

  const clickHandler = () => {
    if (groupName && groupName != 'none'){
      setCategoryId(Number(groupId))
    } else if (subName && subName != 'none') {
      setCategoryId(subId)
    } else {
      setCategoryId(mainId)
    }

    console.log(categoryId)
    setIsOpen(false)
  }


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Typography
        variant="h5"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontWeight: '450',
          marginBottom: '10px',
        }}
      >
        카테고리
      </Typography>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box sx={{ width: '31%' }}>
          <FormControl fullWidth>
            <InputLabel id="main">대분류</InputLabel>
            <Select
              labelId="main"
              value={mainName}
              label="대분류"
              onChange={mainChangeHandler}
              defaultValue={'none'}
              className={styles.selects}
            >
              {categories.map((item) => {
                if (item.level === 1) {
                  return (
                    <MenuItem
                      key={item.id}
                      value={item.name}
                      onClick={() => {
                        setMainId(item.id);
                        // setGroupName('none');
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '31%' }}>
          <FormControl fullWidth>
            <InputLabel id="sub">중분류</InputLabel>
            <Select
              labelId="sub"
              value={subName}
              label="중분류"
              onChange={subChangeHandler}
              className={styles.selects}
            >
              {categories.map((item) => {
                if (item.level === 2 && item.parentCategoryId === mainId) {
                  return (
                    <MenuItem
                      key={item.id}
                      value={item.name}
                      onClick={() => setSubId(item.id)}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '31%' }}>
          <FormControl fullWidth>
            <InputLabel id="sub">소분류</InputLabel>
            <Select
              labelId="group"
              value={groupName}
              label="소분류"
              onChange={groupChangeHandler}
              className={styles.selects}
            >
              {categories.map((item) => {
                if (
                  item.level === 3 &&
                  item.parentCategoryId === subId &&
                  item.parentCategory.parentCategoryId == mainId
                ) {
                  return (
                    <MenuItem
                      key={item.id}
                      value={item.name}
                      onClick={() => setGroupId(item.id)}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div
        style={{
          marginTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Link to={'/category'} style={{ float: 'right' }}>
          <Button
            size="small"
            variant="contained"
            sx={{
              width: '100%',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: '#265eba',
              '&:hover': {
                backgroundColor: '#5990f0',
                color: '#eff0f3',
              },
            }}
          >
            카테고리 추가하기
          </Button>
        </Link>
        <Button
          onClick={clickHandler}
          size="small"
          variant="contained"
          sx={{ width: '30%' }}
        >
          선택하기
        </Button>
      </div>
    </Modal>
  );
};

export default CategoryModal;
