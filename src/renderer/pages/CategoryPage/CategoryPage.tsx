import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './CategoryPage.module.scss';
import { TreeItem, TreeView } from '@mui/lab';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  businessState,
  categoriesState,
  tokenState,
} from 'renderer/recoil/states';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from 'main/category/dtos/create-category.dto';
import { Category } from 'main/category/entities/category.entity';
import { ChevronRight, ExpandMore, AddRounded } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { CategoryResult } from 'main/common/dtos/category-result.dto';

const CategoryPage = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [currentCategory, setCurrentCategory] = useState<CategoryResult[]>();
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [clicked, setClicked] = useState<boolean>(false);
  const [addNew, setAddNew] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [levelName, setLevelName] = useState<string>('');
  const [parentCategoryName, setParentCategoryName] = useState<string>('');
  const [parentCategoryId, setParentCategoryId] = useState<number>(0);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState({ name: '' });

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
          setCurrentCategory(categories);
        } else {
          console.error(error);
        }
      }
    );
  }, []);

  const clickAddHandler = (item: Category, name: string) => {
    setCategoryId('');
    setCategoryName('');
    setLevelName('');
    setParentCategoryName('');

    if (name === 'add') {
      setClicked(false);
      setAddNew(true);

      if (item == null) {
        setLevelName('대분류');
      } else if (item.level === 1) {
        setLevelName('중분류');
      } else if (item.level === 2) {
        setLevelName('소분류');
      }

      if (nameInputRef.current !== null) nameInputRef.current.focus();
      if (item) {
        setParentCategoryName(item.name);
        setParentCategoryId(item.id);
      } else {
        setParentCategoryName('');
        setParentCategoryId(null);
      }
      setCategoryId((categories.length + 1).toString());
    } else if (name === 'item') {
      setClicked(true);
      setAddNew(false);

      if (item.level === 1) {
        setLevelName('대분류');
      } else if (item.level === 2) {
        setLevelName('중분류');
      } else if (item.level === 3) {
        setLevelName('소분류');
      }

      if (item) {
        setCategoryId(item.id.toString());
        categories.map((cat) => {
          if (cat.id == item.parentCategoryId) {
            setParentCategoryName(cat.name);
          }
        });
        setParentCategoryId(item.parentCategoryId);
      } else {
        setParentCategoryName('');
        setParentCategoryId(null);
      }
      setCategoryName(item.name);
    }
  };

  const newCategoryHandler = () => {
    if (categoryName === '') {
      setErrors({ name: '카테고리명이 입력되지 않았습니다.' });
      return;
    }

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
    setCategoryId('');
    setCategoryName('');
    setLevelName('');
    setParentCategoryName('');
  };

  // const updateDataHandler = () => {
  //   const newData: UpdateCategoryInput = {
  //     name: categoryName,
  //     token,
  //     businessId: business.id,
  //   };

  //   window.electron.ipcRenderer.sendMessage('update-category', {
  //     ...newData,
  //   });
  //   window.electron.ipcRenderer.on(
  //     'update-category',
  //     ({ ok, error }: UpdateCategoryOutput) => {
  //       if (ok) {
  //         window.electron.ipcRenderer.sendMessage('get-categories', {
  //           token,
  //           business: business.id,
  //         });
  //         window.electron.ipcRenderer.on(
  //           'get-categories',
  //           ({ ok, error, categories }: GetCategoriesOutput) => {
  //             if (ok) {
  //               setCategories(categories);
  //             } else if (error) {
  //               console.error(error);
  //             }
  //           }
  //         );
  //       } else if (error) {
  //         console.log(error);
  //       }
  //     }
  //   );
  // };

  // const clickDeleteHandler = (nodes: Category) => {
  //   if ( window.confirm('정말 삭제하시겠습니까?') ){
  //     window.electron.ipcRenderer.sendMessage('delete-category', {
  //       id: nodes.id,
  //       token,
  //       businessId: business.id,
  //     });

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
  //                 console.log(categories)
  //                 setCategories(categories);
  //               } else if (error) {
  //                 console.error(error);
  //               }
  //             }
  //           );
  //         } else if (error) {
  //           console.log(error);
  //         }
  //       }
  //     )
  //   }
  // }

  const addTreeItem = (item: Category, text: string) => {
    return (
      <TreeItem
        label={<Typography sx={{ fontSize: '14px' }}>{text}</Typography>}
        key={item.name}
        nodeId={`add${item.name}${Math.random() * 10}`}
        icon={<AddRounded />}
        sx={{ marginTop: '15px' }}
        onClick={() => clickAddHandler(item, 'add')}
      />
    );
  };

  const addTree = (item: Category, childrenDiff: boolean) => {
    if (childrenDiff) {
      if (item.level === 1) return addTreeItem(item, '중분류 추가하기');
      else if (item.level == 2) return addTreeItem(item, '소분류 추가하기');
    } else {
      if (item.level === 1) return addTreeItem(item, '중분류 추가하기');
      else if (item.level === 2) return addTreeItem(item, '소분류 추가하기');
    }
  };

  const idChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryId(e.target.value);
  };

  const renderTree = (nodes: CategoryResult) => (
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
        </div>
      }
      onClick={() => clickAddHandler(nodes, 'item')}
      sx={{ marginTop: '15px' }}
    >
      {categories.map((item) => {
        if (item.parentCategoryId == nodes.id) {
          return renderTree(item);
        }
      })}
      {!nodes.childCategories
        ? nodes.childCategories.map(() => addTree(nodes, true))
        : nodes.level < 4
        ? addTree(nodes, false)
        : null}
    </TreeItem>
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const pattern = /^[ㄱ-ㅎ가-힣a-zA-Z-\s]*$/;
    if (!pattern.test(value)) {
      setErrors({
        name: '한글, 영문, 기호 - 외의 문자는 입력하실 수 없습니다.',
      });
      console.log('aa');
    } else if (value.startsWith(' ')) {
      setErrors({ name: '첫 자리는 공백으로 시작하실 수 없습니다.' });
    } else if (value == '' || value) {
      setErrors({ name: '' });
      setCategoryName(value);
    }
  };

  return (
    <div className={styles.category}>
      <div className={styles.container}>
        <div className={styles.search}></div>
        <div className={styles.treeContainer}>
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            sx={{
              height: '530px',
              flexGrow: 1,
              maxWidth: 400,
              overflow: 'auto',
              padding: '20px',
            }}
          >
            {categories.map((item) => {
              if (item.level == 1) {
                return renderTree(item);
              }
            })}
            <TreeItem
              label={
                <Typography sx={{ fontSize: '14px' }}>
                  대분류 추가하기
                </Typography>
              }
              nodeId={(Math.random() * 20).toString()}
              icon={<AddRounded />}
              sx={{ marginTop: '15px' }}
              onClick={() => clickAddHandler(null, 'add')}
            />
          </TreeView>
        </div>
      </div>
      <div style={{ width: '55%' }}>
        <div style={{ height: '100%' }}>
          <div className={styles.infoContent}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '24px',
                marginTop: '-10px',
              }}
            >
              카테고리 생성
            </Typography>
            <div className={styles.list}>
              <div>
                <div>
                  <div className={styles.item}>
                    <p className={styles.labels}>카테고리 번호</p>
                    <input
                      className={`${styles.dataInput} ${styles.disabled}`}
                      value={categoryId}
                      onChange={idChangeHandler}
                      readOnly
                    />
                  </div>
                  <div className={styles.itemWithError}>
                    <p className={styles.labels}>카테고리명</p>
                    <input
                      className={
                        errors.name.length > 0
                          ? styles.hasError
                          : styles.dataInput
                      }
                      ref={nameInputRef}
                      value={categoryName}
                      onChange={changeHandler}
                      maxLength={20}
                      readOnly={!addNew}
                      required
                    />
                  </div>
                  {errors.name.length > 0 ? (
                    <span className={styles.errorMessage}>{errors.name}</span>
                  ) : !clicked ? (
                    <span className={styles.infoMessage}>
                      &apos;분류 추가하기&apos;를 눌러 카테고리를 추가하세요.
                    </span>
                  ) : (
                    <span
                      className={styles.infoMessage}
                      style={{ marginTop: '16.5px' }}
                    ></span>
                  )}
                  <div className={styles.item}>
                    <p className={styles.labels}>분류명</p>
                    <input
                      className={`${styles.dataInput} ${styles.disabled}`}
                      value={levelName}
                      readOnly
                    />
                  </div>
                  <div className={styles.item} hidden>
                    <p className={styles.labels} hidden>
                      부모 카테고리
                    </p>
                    <input
                      hidden
                      className={styles.dataInput}
                      defaultValue={parentCategoryName}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className={styles.buttonList}>
                {clicked ? (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginLeft: '30px' }}
                    color="error"
                  >
                    <DeleteIcon sx={{ fontSize: '23px' }} />
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
                    // onClick={updateDataHandler}
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
