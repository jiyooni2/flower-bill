import { addressValidation, nameValidation, numberValidation, ownerValidation } from "renderer/pages/StorePage/validation"

export const validation = (value: string) => {
  let error = '';
  let success = false;

  const pattern = /^[ㄱ-ㅎ가-힣a-zA-Z]*$/;
  if (!pattern.test(value)) {
    success = false;
    error = '한글, 영문 외의 문자는 작성하실 수 없습니다.'
  } else {
    success = true;
    error = ''
  }

  return {
    success: success,
    error: error,
  }
};

export const switched = (name: string, value: string) => {
  switch (name) {
    case 'businessNumber': return numberValidation(value);
    case 'name': return nameValidation(value);
    case 'owner': return ownerValidation(value);
    case 'address': return addressValidation(value);
    case 'sector': return validation(value);
    case 'type': return validation(value);
  }
};
