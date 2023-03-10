import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, categoriesState, tokenState } from 'renderer/recoil/states';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { Category } from 'main/category/entities/category.entity';
import styles from './CategoryModal.module.scss'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';


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

  console.log(mainName, subName, groupName)

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


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Typography
        variant="h5"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontWeight: '450',
          marginBottom: '20px',
        }}
      >
        카테고리
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: 110 }}>
          <FormControl fullWidth>
            <InputLabel id="main">대분류</InputLabel>
            <Select
              size="small"
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
        <Box sx={{ width: 110 }}>
          <FormControl fullWidth>
            <InputLabel id="sub">중분류</InputLabel>
            <Select
              size="small"
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
        <Box sx={{ width: 110 }}>
          <FormControl fullWidth>
            <InputLabel id="sub">소분류</InputLabel>
            <Select
              size="small"
              labelId="group"
              value={groupName}
              label="소분류"
              onChange={groupChangeHandler}
              className={styles.selects}
            >
              {/* <MenuItem value="none">------------------</MenuItem> */}
              {categories.map((item) => {
                if (item.level === 3 && item.parentCategoryId === subId && item.parentCategory.parentCategoryId == mainId) {
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
          display: 'flex',
          justifyContent: 'center',
          height: '50px',
          marginTop: '30px',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1">
          선택된 카테고리 :{' '}
          {groupName && groupName != 'none' ? (
            <span style={{ fontWeight: '500' }}>
              {groupId}번 {groupName}
            </span>
          ) : subName ? (
            <span style={{ fontWeight: '500' }}>
              {subId}번 {subName}
            </span>
          ) : (
            <span style={{ fontWeight: '500' }}>
              {mainId}번 {mainName}
            </span>
          )}
        </Typography>
      </div>
    </Modal>
  );
};

export default CategoryModal;
