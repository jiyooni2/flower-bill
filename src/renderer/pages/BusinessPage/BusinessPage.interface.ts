export type Inputs = {
  businessNumber: string;
  name: string;
  businessOwnerName: string;
  address: string;
  bank: string;
  bankNumber: string;
  bankOwner: string;
};

export interface DeleteModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
}
