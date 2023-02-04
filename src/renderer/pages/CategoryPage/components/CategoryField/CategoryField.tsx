import { useState } from 'react';
// import { useRecoilState } from 'recoil';
// Data
// import { categoryState } from 'renderer/recoil/states';
// import { Category } from 'main/category/entities/category.entity';
// import { GetCategoryOutput } from 'main/category/dtos/get-category.dto';
// Child Components for Category CRUD
import AddCategory from '../AddCategory/AddCategory';
import EditCategory from '../EditCategory/EditCategory';
// Styles
import {TreeView, TreeItem, treeItemClasses } from '@mui/lab';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styledEngine from '@mui/styled-engine';  // 새로 추가함

// type of data
interface RenderTree {
  id: string;
  category: string;
  name: string;
  children: RenderTree[];
}

interface IProps {
  data: RenderTree[];
}

// Category 분류 방법 : 대분류(Main), 중분류(Sub), 소분류(Group)
const CategoryField = (props: IProps) => {
  // const [categories, setCategory] = useRecoilState(categoryState);
  const [expanded] = useState<string[]>(['0']);
  const [dataSet, setDataSet] = useState<RenderTree[]>([]);

  // 데이터베이스의 데이터를 가져오는 코드
  // -useEffect(() => {
  //   window.electron.ipcRenderer.sendMessage('get-category', {});
  //   window.electron.ipcRenderer.on(
  //     'get-category',
  //     (args: GetCategoryOutput) => {
  //       setCategory(args.category as Category);
  //     }
  //   );
  // }, []);

  // console.log(categories)  // 데이터베이스 데이터

  const passData = (data: RenderTree[]) => {
    setDataSet(data);
  };

  // 매 카테고리 데이터마다 '추가하기' 추가
  const addTree = (nodes: RenderTree) => {
    let component;
    if (nodes.category !== 'Group') {
      expanded.push(nodes.id);
    }
    nodes.children.map((item) => {
      if (item.category === 'Sub') {
        component = (
          <AddCategory
            label={'중분류'}
            data={props.data}
            parentData={nodes}
            passData={passData}
          ></AddCategory>
        );
      } else if (item.category === 'Group' && !item.children[0]) {
        component = (
          <AddCategory
            label={'소분류'}
            data={props.data}
            parentData={nodes}
            passData={passData}
          />
        );
      }
    });
    return component;
  };

  // 하위에 카테고리 데이터가 없다면 '추가하기' 추가
  const addTreeWhenNoChildren = (nodes: RenderTree) => {
    if (nodes.children && nodes.children.length == 0) {
      if (nodes.category === 'Sub') {
        return (
          <AddCategory
            label={'소분류'}
            data={props.data}
            parentData={nodes}
            passData={passData}
          ></AddCategory>
        );
      } else if (nodes.category === 'Main') {
        return (
          <AddCategory
            label={'중분류'}
            data={props.data}
            parentData={nodes}
            passData={passData}
          />
        );
      }
    }
  };

  // 모든 카테고리 데이터에 tree 형태 추가
  const renderTree = (nodes: RenderTree) => (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={<EditCategory data={nodes} />}
      sx={{ margin: '1.5% 0' }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((items) => renderTree(items))
        : null}
      {addTreeWhenNoChildren(nodes)}
      {addTree(nodes)}
    </StyledTreeItem>
  );

  /* styledEngien을 사용하여 Main카테고리와 Sub카테고리의 icon을 연결하는 line 추가 */
  const StyledTreeItem = styledEngine(TreeItem)(
    () => {
      return {
        [`& .${treeItemClasses.group}`]: {
          marginLeft: 16,
          paddingLeft: 18,
          borderLeft: `1px solid rgb(150, 150, 150)`,
        },
      };
    }
  );

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ChevronRightIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={expanded}
      sx={{
        height: '88%',
        flexGrow: 1,
        maxWidth: 800,
        overflowY: 'auto',
        margin: '5% 4.5% 2.5% 7%',
      }}
    >
      {props.data.map((dataitem) => renderTree(dataitem))}

      <AddCategory
        label={'대분류'}
        data={props.data}
        parentData={props.data[0]}
        passData={passData}
      />
    </TreeView>
  );
};

export default CategoryField;
