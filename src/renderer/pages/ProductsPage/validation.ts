import { Input } from "./types";

export const nameValidation = (value: string) => {
  const pattern = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]*$/;
  if (!pattern.test(value)) {
    return {
      success: false,
      error: '한글, 영문, 공백 외의 문자는 작성하실 수 없습니다.'
    }
  } else if (value.startsWith(' ')) {
    return {
      success: false,
      error: '공백으로 시작할 수 없습니다.'
    }
  } else {
    return {
      success: true,
      error: ''
    }
  }
}


export const priceValidation = (value: string) => {
  const pattern = /[0-9,]*$/g;

  if (value.startsWith('0')) {
    return {
      success: false,
      error: '0으로 시작할 수 없습니다.'
    }
  } else if (!pattern.test(value)) {
    return {
      success: false,
      error: '숫자 외의 문자는 작성하실 수 없습니다.'
    }
  } else {
    return {
      success: true,
      error: ''
    }
  }
}


export const createValidation = (inputs: Input) => {
  if (inputs.name == '') {
    return {
      name: 'name',
      success: false,
      error: '상품명이 입력되지 않았습니다.'
    }
  }
  if (inputs.price == '') {
    return {
      name: 'price',
      success: false,
      error: '판매가가 입력되지 않았습니다.'
    }
  }
  if (inputs.price.length < 3) {
    return {
      name: 'price',
      success: false,
      error: '100원 이상 작성하실 수 있습니다.'
    }
  }

  return {
    success: true,
  }
}


export const switched = (name: string, value: string) => {
  if (name === 'name') return nameValidation(value);
  else if (name === 'price') return priceValidation(value);
};
