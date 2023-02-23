import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './CategoryPage.module.scss';
import { TreeItem, TreeView } from '@mui/lab';
// import { useRecoilState } from 'recoil';
// import { categoryState } from 'renderer/recoil/states';
// import { GetCategoryOutput } from 'main/category/dtos/get-category.dto';
// import { Category } from 'main/category/entities/category.entity';
import { Category } from '../../types/index';
import { ChevronRight, ExpandMore, AddRounded, Delete } from '@mui/icons-material';
import { Typography } from '@mui/material';

const data: Category[] = [
  {
    name: '국산',
    level: 1,
    parentCategory: null,
    childCategories: [
      {
        name: '장미과',
        level: 2,
        parentCategory: null,
        childCategories: [
          {
            name: '빨간 장미',
            level: 3,
            parentCategory: null,
            childCategories: null,
            products: null,
          }
        ],
        products: null,
      },
    ],
    products: null,
  },
  {
    name: '외국산',
    level: 1,
    parentCategory: null,
    childCategories: null,
    products: null,
  }
];


const CategoryPage = () => {
  // const [categories, setCategories] = useRecoilState(categoryState);

  // useEffect(() => {
  //   window.electron.ipcRenderer.sendMessage('get-category', {});
  //   window.electron.ipcRenderer.on(
  //     'get-category',
  //     (args: GetCategoryOutput) => {
  //       setCategories(args.category as Category);
  //     }
  //   );
  // }, []);

  const [categories, setCategories] = useState<Category[]>(data);
  const [keyword, setKeyWord] = useState<string>('');
  const [parentCategoryName, setParentCategoryName] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string[]>(['장미과']);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyWord(e.target.value);
  };

  const clickAddHandler = (item: Category) => {
    setClicked(true);
    if (nameInputRef.current !== null) nameInputRef.current.focus();
    if (item) setParentCategoryName(item.name);
    else setParentCategoryName('')
  };

  const clickeDeleteHandler = (nodes: Category) => {
    console.log(nodes)
  }

  const addTreeItem = (item: Category, text: string) => {
    return (
      <TreeItem
        label={<Typography sx={{ fontSize: '14px'}}>{text}</Typography>}
        key={item.name}
        nodeId={item.name}
        icon={<AddRounded />}
        sx={{ marginTop: '15px' }}
        onClick={() => clickAddHandler(item)}
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
      nodeId={Math.random().toString()}
      label={
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '17px', fontWeight: '500' }}>
            {nodes.name}
          </Typography>
          <Delete id="del" sx={{ fontSize: '16px', marginTop: '4px'}} onClick={() => clickeDeleteHandler(nodes)} />
        </div>
      }
      sx={{ marginTop: '15px' }}
    >
      {Array.isArray(nodes.childCategories)
        ? nodes.childCategories.map((items) => renderTree(items))
        : null}
      {nodes.childCategories
        ? nodes.childCategories.map(() => addTree(nodes, true))
        : nodes.level < 3
        ? addTree(nodes, false)
        : ''}
    </TreeItem>
  );

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
            defaultExpanded={expanded}
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            // defaultSelected={[keyword]}
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
              label={<Typography sx={{ fontSize: '14px' }}>대분류 추가하기</Typography>}
              nodeId={Math.random().toString()}
              icon={<AddRounded />}
              sx={{ marginTop: '15px' }}
              onClick={() => clickAddHandler(null)}
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
                    <p className={styles.labels}>카테고리 이름</p>
                    <input className={styles.dataInput} ref={nameInputRef} />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>
                      부모 카테고리
                      <br />
                      이름
                    </p>
                    <input
                      className={styles.dataInput}
                      value={parentCategoryName}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className={styles.buttonList}>
                <div></div>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ marginRight: '10px' }}
                >
                  생성
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
