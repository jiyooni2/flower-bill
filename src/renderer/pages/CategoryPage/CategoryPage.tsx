import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './CategoryPage.module.scss';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';

interface Category {
  id: number;
  name: string;
  level: string;
  parentCategoryId: string | null;
}

const CATEGORY = [
  {
    id: 1,
    name: '국산',
    level: '1',
    parentCategoryId: null,
  },
  {
    id: 2,
    name: '미국산',
    level: '1',
    parentCategoryId: null,
  },
  {
    id: 3,
    name: '장미',
    level: '2',
    parentCategoryId: '1',
  },
];

const SellerPage = () => {
  const [categories, setCategories] = useState<Category[]>(CATEGORY);
  const [keyword, setKeyWord] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [nameHasError, setNameHasError] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [clickedData, setClickedData] = useState<Category[]>([
    { id: 0, name: '', level: '', parentCategoryId: '' },
  ]);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = categories.filter((category) => {
        return category.name.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setCategories(results);
    } else {
      setCategories(CATEGORY);
    }

    setKeyWord(keyword);
  };


  const changeDataHandler = (event: React.MouseEvent<unknown>, data: Category ) => {
    setClicked(true)

    categories.forEach((item) => {
      if (item.name === data.name) {
        setName(item.name);
        setLevel(item.level);
        setParentCategoryId(item.parentCategoryId);
        setClickedData([
          {
            id: item.id,
            name: item.name,
            level: item.level,
            parentCategoryId: item.parentCategoryId,
          },
        ]);
      }
    });
  };

  const deleteDataHandler = () => {
    setCategories(
      categories.filter((category) => category.name !== clickedData[0].name)
    );
  };

  const changeStoreDataHandler = (event: React.ChangeEvent<HTMLInputElement>, dataName:string) => {
    if (dataName === 'name') {
      if (event.target.value == ''){
        setNameHasError(false)
      }
      setName(event.target.value);
    } else if (dataName === 'level') {
      setLevel(event.target.value);
    } else if (dataName === 'parent') {
      setParentCategoryId(event.target.value);
    }
  };

  const clearInputs = () => {
    setClicked(false)

    setName('');
    setLevel('');
    setParentCategoryId('');
    setClickedData([
      {
        id: 0,
        name: '',
        level: '',
        parentCategoryId: '',
      },
    ]);
    setNameHasError(false);
  };

  const addDataHandler = () => {
    if (categories.findIndex(data => data.name == name) != -1){
      setNameHasError(true);
      return;
    }
    if (name != '' && level != '' && parentCategoryId != '') {
        const newData = {
          id: categories.length + 1,
          name: name,
          level: level,
          parentCategoryId: parentCategoryId,
        };
        setCategories((data) => [...data, newData]);
        clearInputs();
    }
  };

  const doubleClickHandler = () => {
    setClicked(false);
  };

  const udpateDataHandler = () => {
    const findIndex = categories.findIndex(element => element.name == clickedData[0].name)
    categories[findIndex] = { ...categories[findIndex], name: name, level: level, parentCategoryId: parentCategoryId };
    setCategories(categories)
    setClicked(true)
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <input
            type="search"
            value={keyword}
            onChange={filter}
            placeholder="판매처 검색"
            className={styles.searchInput}
          />
          {/* <Button
            sx={{ color: 'black', marginLeft: '-3rem', paddingTop: '25px' }}
          >
            검색
          </Button> */}
          <div className={styles.userList}>
            <div>
              <TableContainer sx={{ width: '100%' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        borderBottom: '1.5px solid black',
                        backgroundColor: 'lightgray',
                        '& th': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '5%' }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '30%' }}
                      >
                        카테고리명
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '20%' }}
                      >
                        레벨
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '30%' }}
                      >
                        부모 카테고리 ID
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories &&
                      categories.length > 0 &&
                      categories.map((item) => (
                        <TableRow
                          key={item.id}
                          className={styles.dataRow}
                          onClick={(event) => changeDataHandler(event, item)}
                          sx={{
                            '& th': {
                              fontSize: '14px',
                            },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ width: '5%' }}
                          >
                            {item.id}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            sx={{ width: '30%' }}
                          >
                            {item.name}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ width: '20%' }}
                          >
                            {item.level}
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            sx={{ width: '30%' }}
                          >
                            {item.parentCategoryId}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {categories && categories.length == 0 && (
                <div className={styles.noResult}>
                  <div>
                    <h3>검색결과가 없습니다.</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className={styles.infoContent}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '24px',
                marginTop: '20px',
              }}
            >
              카테고리 정보
            </Typography>
            <button className={styles.clearInput} onClick={clearInputs}>
              비우기
            </button>
            <div className={styles.list}>
              <div>
                <div>
                  <div className={styles.itemWithError}>
                    <p className={styles.labels}>새 카테고리 이름</p>
                    <input
                      value={name}
                      className={styles.dataInput}
                      onDoubleClick={doubleClickHandler}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'name')
                      }
                    />
                  </div>
                  {nameHasError ? (
                    <p className={styles.errorMessage}>
                      동일한 카테고리 이름이 이미 존재하고 있습니다.
                    </p>
                  ) : (
                    <p className={styles.item}></p>
                  )}
                  <div className={styles.item}>
                    <p className={styles.labels}>새 카테고리 레벨</p>
                    <input
                      value={level}
                      className={styles.dataInput}
                      onDoubleClick={doubleClickHandler}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'level')
                      }
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>새 부모 카테고리 ID</p>
                    <input
                      value={parentCategoryId}
                      className={styles.dataInput}
                      onDoubleClick={doubleClickHandler}
                      readOnly={clicked}
                      onChange={(event) =>
                        changeStoreDataHandler(event, 'parent')
                      }
                    />
                  </div>
                </div>
                <div className={styles.buttonList}>
                  {clickedData[0].name.length > 0 ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ marginLeft: '40px' }}
                      color="error"
                      onClick={deleteDataHandler}
                    >
                      삭제
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  {clickedData[0].name.length > 0 ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ marginRight: '10px' }}
                      onClick={udpateDataHandler}
                      style={{ backgroundColor: 'coral' }}
                    >
                      수정
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ marginRight: '10px' }}
                      onClick={addDataHandler}
                    >
                      생성
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
