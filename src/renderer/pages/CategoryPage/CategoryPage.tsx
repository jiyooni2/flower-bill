import { useEffect, useRef, useState } from 'react';
import styles from './CategoryPage.module.scss';
import { TreeItem, TreeView } from '@mui/lab';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  businessState,
  categoriesState,
  tokenState,
} from 'renderer/recoil/states';
import { Category } from 'main/category/entities/category.entity';
import { ChevronRight, ExpandMore, AddRounded } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import { CategoryResult } from 'main/common/dtos/category-result.dto';
import InfoModal from 'renderer/components/InfoModal/InfoModal';
import Buttons from './components/Buttons';
import { toast } from 'react-toastify';

const CategoryPage = () => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [clicked, setClicked] = useState<boolean>(false);
  const [addNew, setAddNew] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [levelName, setLevelName] = useState<string>('');
  const [parentCategoryName, setParentCategoryName] = useState<string>('');
  const [parentCategoryId, setParentCategoryId] = useState<number>(0);
  const [developOpen, setDevelopOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState({ success: '', error: '' });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (alert.error && !alert.success) {
      if (alert.error.startsWith('네트워크')) {
        toast.error(alert.error.split('네트워크')[1], {
          autoClose: 10000,
          position: 'top-right',
          hideProgressBar: true,
        });
      } else {
        toast.error(alert.error, {
          autoClose: 3000,
          position: 'top-right',
        });
      }
    } else if (alert.success && !alert.error) {
      toast.success(alert.success, {
        autoClose: 2000,
        position: 'top-right',
      });
    }
  }, [alert]);

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
          setAlert({ success: '', error });
        }
      }
    );

    return () => {
      getCategoriesRemover();
    };
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
      setAddNew(true);
      if (item.level === 1) {
        setLevelName('대분류');
      } else if (item.level === 2) {
        setLevelName('중분류');
      } else if (item.level === 3) {
        setLevelName('소분류');
      }
      if (item) {
        setCategoryId(item.id.toString());
        categories?.map((cat) => {
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
    nameInputRef.current.focus();
  };

  const addTreeItem = (item: Category, text: string) => {
    return (
      <TreeItem
        label={<Typography sx={{ fontSize: '14px' }}>{text}</Typography>}
        key={`add${item.name}${Math.random() * 10}`}
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

  const renderTree = (nodes: CategoryResult) => (
    <TreeItem
      key={`${nodes.name}${nodes.parentCategoryId}${nodes.id}`}
      nodeId={`${nodes.name}${nodes.parentCategoryId}${nodes.id}`}
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
      {categories?.map((item) => {
        if (item.parentCategoryId == nodes.id) {
          return renderTree(item);
        }
      })}
      {!nodes.childCategories
        ? nodes.childCategories?.map(() => addTree(nodes, true))
        : nodes.level < 4
        ? addTree(nodes, false)
        : null}
    </TreeItem>
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCategoryName(value);
  };

  const idChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryId(e.target.value);
  };

  return (
    <>
      <InfoModal
        isOpen={developOpen}
        setIsOpen={setDevelopOpen}
        text="이 기능은 현재 개발중입니다."
      />
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
              {categories?.map((item) => {
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
                nodeId={'addMain'}
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
                    <div className={styles.item}>
                      <p className={styles.labels}>카테고리명</p>
                      <input
                        className={styles.dataInput}
                        ref={nameInputRef}
                        value={categoryName}
                        onChange={changeHandler}
                        maxLength={20}
                        readOnly={!addNew}
                        required
                      />
                    </div>
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
                  <Buttons
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    setCategoryId={setCategoryId}
                    categoryId={categoryId}
                    setLevelName={setLevelName}
                    setParentCategoryName={setParentCategoryName}
                    parentCategoryId={parentCategoryId}
                    clicked={clicked}
                    parentCategoryName={parentCategoryName}
                    alert={alert}
                    setAlert={setAlert}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CategoryPage;
