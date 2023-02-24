import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './CategoryPage.module.scss';
import { TreeItem, TreeView } from '@mui/lab';
import { useRecoilState } from 'recoil';
import { categoryState } from 'renderer/recoil/states';
import { GetCategoryOutput } from 'main/category/dtos/get-category.dto';
import { Category } from 'main/category/entities/category.entity';
import { ChevronRight, ExpandMore, AddRounded, Delete } from '@mui/icons-material';
import { Typography } from '@mui/material';

// const data: Category[] = [
//   {
//     name: '국산',
//     level: 1,
//     parentCategory: null,
//     parentCategoryId: null,
//     childCategories: [
//       {
//         name: '장미과',
//         level: 2,
//         parentCategory: {
//           name: '국산',
//           level: 1,
//           parentCategory: null,
//           childCategories: null,
//           products: null,
//         },
//         parentCategoryId: 1,
//         childCategories: [
//           {
//             name: '빨간 장미',
//             level: 3,
//             parentCategory: {
//               name: '장미과',
//               level: 2,
//               parentCategory: {
//                 name: '국산',
//                 level: 1,
//                 parentCategory: null,
//                 childCategories: null,
//                 products: null,
//               },
//               parentCategoryId: null,
//               childCategories: null,
//               products: null,
//             },
//             childCategories: null,
//             products: null,
//           },
//         ],
//         products: null,
//       },
//     ],
//     products: null,
//   },
// ];


const CategoryPage = () => {
  const [categories, setCategories] = useRecoilState(categoryState);

  // const [categories, setCategories] = useState<Category>(data);
  const [keyword, setKeyWord] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [levelName, setLevelName] = useState<string>('');
  const [parentCategoryName, setParentCategoryName] = useState<string>('');
  const [parentCategoryId, setParentCategoryId] = useState<number>(0);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-category', {});
    window.electron.ipcRenderer.on(
      'get-category',
      (args: GetCategoryOutput) => {
        setCategories(args.category as Category);
      }
    );
    console.log(categories);

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
      if (!item) setLevelName('대분류')
      else if (item.level === 1) setLevelName('중분류')
      else if (item.level === 2) setLevelName('소분류')

      if (nameInputRef.current !== null) nameInputRef.current.focus();
      if (item) {setParentCategoryName(item.name); setParentCategoryId(item.id) }
      else {setParentCategoryName(''); setParentCategoryId(null)}
    } else if (name === "item") {
      setClicked(true);

      if (item.level === 1) setLevelName('대분류');
      else if (item.level === 2) setLevelName('중분류');
      else if (!item) setLevelName('소분류');

      if (item.parentCategory === null) {
        setParentCategoryName('')
      } else {
        setParentCategoryName(item.parentCategory.name);
      }
      setCategoryName(item.name);
    }


    const newCategory = {
      name: categoryName,
      parentCategoryId: parentCategoryId,
    };

    window.electron.ipcRenderer.sendMessage('create-category', newCategory);
  };


  const clickDeleteHandler = (nodes: Category) => {
    console.log(nodes)

    const delCategory = {
      id: nodes.id
    };

    window.electron.ipcRenderer.sendMessage('delete-category', delCategory);
  }


  const newCategoryHandler = () => {
    const newCategory = {
      name: categoryName,
      parentCategoryId: parentCategoryId,
    };

    window.electron.ipcRenderer.sendMessage('create-category', newCategory);

    setCategoryName('');
    setLevelName('');
    setParentCategoryName('');
  };

  // const updateCategoryHandler = () => {

  // };


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
            onClick={() => clickDeleteHandler(nodes)}
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
                    // onClick={updateCategoryHandler}
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
