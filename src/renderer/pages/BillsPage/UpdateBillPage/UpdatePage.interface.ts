export interface BodyProps {
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
  page: number;
}

export interface ButtonProps {
  setIsSearchStoreOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDiscountOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMemoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBillOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
