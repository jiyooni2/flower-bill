export type Inputs = {
  clicked: boolean;
  addNew: boolean;
  categoryId: string;
  categoryName: string;
  levelName: string;
  parentCategoryName: string;
  parentCategoryId: number;
}

export type Errors = {
  categoryId: string;
  categoryName: string;
  levelName: string;
  parentCategoryName: string;
  parentCategoryId: number;
}
