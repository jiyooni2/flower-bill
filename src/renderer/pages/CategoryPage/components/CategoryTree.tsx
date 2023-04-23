import { AddRounded, ChevronRight, ExpandMore } from "@mui/icons-material";
import { TreeItem, TreeView } from "@mui/lab";
import { Typography } from "@mui/material";
import { Category } from "main/category/entities/category.entity";
import { CategoryResult } from "main/common/dtos/category-result.dto";
import { useRecoilValue } from "recoil";
import { categoriesState } from "renderer/recoil/states";
import { Inputs } from "../types";
import { addLogic } from "../validation";


type IProps = {
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  inputs: Inputs;
  nameInputRef: React.MutableRefObject<HTMLInputElement>;
}


const CategoryTree = ({ setInputs, inputs, nameInputRef  } : IProps) => {
  const categories = useRecoilValue(categoriesState);


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

  const clickAddHandler = (item: Category, name: string) => {
    const addFunction = addLogic(item, name, setInputs, inputs, nameInputRef, categories);
    console.log('AddFunction!', addFunction)
    setInputs({...inputs, ...addFunction})
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

  return (
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
  )
}

export default CategoryTree;
