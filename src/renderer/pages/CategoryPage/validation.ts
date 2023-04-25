import { Category } from "main/category/entities/category.entity";

export const changeValidation = (value: string) => {
  const pattern = /^[ㄱ-ㅎ가-힣a-zA-Z0-9-\s]*$/;
  if (!pattern.test(value)) {
    return {
      success: false,
      error: '기호 - 외의 특수문자는 입력하실 수 없습니다.'
    }
  } else if (value.startsWith(' ')) {
    return {
      success: false,
      error: '첫 자리는 공백으로 시작하실 수 없습니다.'
    }
  } else {
    return {
      success: true,
      error: ''
    }
  }
};
