import React from "react";

export interface ButtonsProps {
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setLevelName: React.Dispatch<React.SetStateAction<string>>;
  setParentCategoryName: React.Dispatch<React.SetStateAction<string>>;
  categoryName: string;
  parentCategoryId: number;
  clicked: boolean;
  parentCategoryName: string;
  categoryId: string;
  alert: {
    success: string;
    error: string;
  };
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
}
