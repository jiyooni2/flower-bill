import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './CategoryPage.module.scss';
import { TreeItem, TreeView } from '@mui/lab';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, categoriesState, tokenState } from 'renderer/recoil/states';
import { CreateCategoryOutput } from 'main/category/dtos/create-category.dto';
import { Category } from 'main/category/entities/category.entity';
import { ChevronRight, ExpandMore, AddRounded, Delete } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { DeleteCategoryOutput } from 'main/category/dtos/delete-category.dto';


const CategoryPage = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const business = useRecoilValue(businessState)
  const token = useRecoilValue(tokenState);
  const [keyword, setKeyWord] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [levelName, setLevelName] = useState<string>('');
  const [level, setLevel] = useState<number>(0);
  const [parentCategoryName, setParentCategoryName] = useState<string>('');
  const [parentCategoryId, setParentCategoryId] = useState<number>(0);
  const nameInputRef = useRef<HTMLInputElement>(null);

  console.log(business.id)

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      business: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-categories',
      ({ ok, error, categories }: GetCategoriesOutput) => {
        if (ok) {
          setCategories(categories)
        } else if (error) {
          console.log(error);
        }
      }
    );
  }, []);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const word = e.target.value;
    if (word !== '') {
      const results = categories.filter((item) => {
        return item.name.toLowerCase().startsWith(word.toLowerCase());
      });
      setCategories(results);
    } else {
      setCategories(categories);
    }
    setKeyWord(word);
  };


  const clickAddHandler = (item: Category, name: string) => {
    if (name === "add"){
      setClicked(false);
      if (!item) {setLevelName('대분류'); setLevel(1)}
      else if (item.level === 1) {setLevelName('중분류'); setLevel(2)}
      else if (item.level === 2) {setLevelName('소분류'); setLevel(3)}

      if (nameInputRef.current !== null) nameInputRef.current.focus();
      if (item) {setParentCategoryName(item.name); setParentCategoryId(item.id) }
      else {setParentCategoryName(''); setParentCategoryId(null)}
    } else {
      setClicked(true);

      if (item.level === 1) {setLevelName('대분류'); setLevel(1)}
      else if (item.level === 2) {setLevelName('중분류'); setLevel(2)}
      else if (!item) {setLevelName('소분류'); setLevel(3)}

      if (item.parentCategory === null) {
        setParentCategoryName('');
      } else {
        setParentCategoryName(item.parentCategory?.name);
      }
      setCategoryName(item.name);
    }
  };


  const updateDataHandler = () => {
      const newData = {
        name: categoryName,
        parentCategoryId: parentCategoryId,
      };

      // window.electron.ipcRenderer.sendMessage('update-category', {
      //   ...newData,
      //   token,
      //   business: business.id,
      // });
      // window.electron.ipcRenderer.on(
      //   'update-category',
      //   ({ ok, error }: UpdateCategoryOutput) => {
      //     if (ok) {
      //       window.electron.ipcRenderer.sendMessage('get-categories', {
      //         token,
      //         business: business.id,
      //       });
      //       window.electron.ipcRenderer.on(
      //         'get-categories',
      //         ({ ok, error, categories }: GetCategoriesOutput) => {
      //           if (ok) {
      //             setCategories(categories);
      //           } else if (error) {
      //             console.log(error);
      //           }
      //         }
      //       );
      //     } else if (error) {
      //       console.log(error);
      //     }
      //   }
      // );
  }


  // const clickDeleteHandler = (nodes: Category) => {
  //   console.log(nodes)

  //   const delCategory = {
  //     id: nodes.id
  //   };

  //   window.electron.ipcRenderer.sendMessage('delete-category', {
  //     ...delCategory,
  //     token,
  //     business: business.id,
  //   });
  //     window.electron.ipcRenderer.on(
  //       'delete-category',
  //       ({ ok, error }: DeleteCategoryOutput) => {
  //         if (ok) {
  //           window.electron.ipcRenderer.sendMessage('get-categories', {
  //             token,
  //             business: business.id,
  //           });
  //           window.electron.ipcRenderer.on(
  //             'get-categories',
  //             ({ ok, error, categories }: GetCategoriesOutput) => {
  //               if (ok) {
  //                 setCategories(categories);
  //               } else if (error) {
  //                 console.log(error);
  //               }
  //             }
  //           );
  //         } else if (error) {
  //           console.log(error);
  //         }
  //       }
  //     )
  // }

  const newCategoryHandler = () => {
    const newData = {
      businessId: business.id,
      name: categoryName,
      parentCategoryId: parentCategoryId,
    };

    window.electron.ipcRenderer.sendMessage('create-category', {
      ...newData,
      token,
      businessId: business.id,
    });

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
            ({ok, error, categories}: GetCategoriesOutput) => {
              if (ok) {
                setCategories(categories)
              } else {
                console.error(error);
              }
            }
          )
          console.log('done!')
        } else if (error) {
          console.log(error);
        }
      }
    );

    setCategoryName('');
    setLevelName('');
    setParentCategoryName('');
  };


  const addTreeItem = (item: Category, text: string) => {
    return (
      <TreeItem
        label={<Typography sx={{ fontSize: '14px'}}>{text}</Typography>}
        key={item.name}
        nodeId={`${item.name}${Math.random()}`}
        icon={<AddRounded />}
        sx={{ marginTop: '15px' }}
        onClick={() => clickAddHandler(item, 'add')}
      />
    )
  }


  const addTree = (item: Category, childrenDiff: boolean) => {
    if (childrenDiff){
      if (item.level === 1) return addTreeItem(item, '중분류 추가하기');
      else if (item.level == 2) return addTreeItem(item, '소분류 추가하기');
    } else {
      if (item.level === 1) return addTreeItem(item, '중분류 추가하기');
      else if (item.level === 2) return addTreeItem(item, '소분류 추가하기');
    }
  };


  const renderTree = (nodes: Category) => (
    <TreeItem
      key={nodes.name}
      nodeId={nodes.name}
      label={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '17px', fontWeight: '500' }}>
            {nodes.name}
          </Typography>
          <Delete
            id="del"
            sx={{ fontSize: '14px', marginTop: '5px', color: 'crimson' }}
            // onClick={() => clickDeleteHandler(nodes)}
          />
        </div>
      }
      onClick={() => clickAddHandler(nodes, 'item')}
      sx={{ marginTop: '15px' }}
    >
      {Array.isArray(nodes.childCategories)
        ? nodes.childCategories.map((items) => renderTree(items))
        : null}
      {nodes.childCategories
        ? nodes.childCategories.map(() => addTree(nodes, true))
        : nodes.level < 3
        ? addTree(nodes, false)
        : null}
    </TreeItem>
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };


  return (
    <div className={styles.category}>
      <div className={styles.container}>
        <div className={styles.search}>
          <input
            type="search"
            value={keyword}
            onChange={filter}
            placeholder="카테고리 검색"
            className={styles.searchInput}
          />
          <Button
            sx={{ color: 'black', marginLeft: '-3rem', paddingTop: '31px' }}
          >
            검색
          </Button>
        </div>
        <div className={styles.treeContainer}>
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            defaultSelected={[keyword]}
            expanded={['국산', '장미과', '빨간 장미', '외국산']}
            multiSelect
            sx={{
              height: '85vh',
              flexGrow: 1,
              maxWidth: 400,
              padding: '20px',
            }}
          >
            {categories.map((item) => renderTree(item))}
            <TreeItem
              label={
                <Typography sx={{ fontSize: '14px' }}>
                  대분류 추가하기
                </Typography>
              }
              nodeId={Math.random().toString()}
              icon={<AddRounded />}
              sx={{ marginTop: '15px' }}
              onClick={() => clickAddHandler(null, 'add')}
            />
          </TreeView>
        </div>
      </div>
      <div style={{ width: '55%' }}>
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
              카테고리 생성
            </Typography>
            <div className={styles.list}>
              <div>
                <div>
                  <div className={styles.item}>
                    <p className={styles.labels}>카테고리명</p>
                    <input
                      className={styles.dataInput}
                      ref={nameInputRef}
                      value={categoryName}
                      onChange={changeHandler}
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>분류명</p>
                    <input
                      className={styles.dataInput}
                      defaultValue={levelName}
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>부모 카테고리</p>
                    <input
                      className={styles.dataInput}
                      defaultValue={parentCategoryName}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className={styles.buttonList}>
                <div></div>
                {!clicked ? (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginRight: '10px' }}
                    onClick={newCategoryHandler}
                  >
                    생성
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginRight: '10px', backgroundColor: 'coral' }}
                    onClick={updateDataHandler}
                  >
                    수정
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
