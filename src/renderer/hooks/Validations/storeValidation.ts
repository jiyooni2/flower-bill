import { useRecoilValue } from "recoil";
import { storesState } from "renderer/recoil/states";

type SignUpValidationProps = {
  storeNumber: string;
  storeName: string;
  owner: string;
  address: string;
};

const Validation = ({ storeNumber, storeName, owner, address }: SignUpValidationProps) => {
  const errors: SignUpValidationProps = {
    storeNumber: '',
    storeName: '',
    owner: '',
    address: '',
  };


  if (!storeNumber) {
    errors.storeNumber = '사업자 번호가 입력되지 않았습니다.';
  } else {
    errors.storeNumber = '';
   }

  if (!storeName) {
    errors.storeName = '판매처명이 입력되지 않았습니다.';
  } else {
    errors.storeName = '';
  }
    if (!owner) {
      errors.owner = '성함이 입력되지 않았습니다.';
    } else if (owner.length < 2) {
      errors.owner = '소유자 성명은 2글자 이상이이어야 합니다.';
    } else {
      errors.owner = '';
    }

    if (!address) {
      errors.address = '사업자 주소가 입력되지 않았습니다.';
    } else {
      errors.address = '';
    }


  return errors;
}

export default Validation;
