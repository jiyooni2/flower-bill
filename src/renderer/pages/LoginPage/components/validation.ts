import { Inputs } from "../types";

export const nameValidation = (value: string) => {
  let success;
  let error;
  const pattern = /\s/g;
  if (pattern.test(value)) {
    success = false;
    error = '* 공백으로 시작할 수 없습니다.'
  } else if (value.length >= 20) {
    success = false;
    error = '* 20자까지 작성할 수 있습니다.'
  } else {
    success = true;
    error = ''
  }

  return {
    success: success,
    error: error,
  }
};

export const idValidation = (value: string) => {
  let success = false;
  let error = '';
  const pattern = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]*$/;
  if (!pattern.test(value)) {
      success = false,
      error = '* 한글, 영문, 공백 외의 문자는 작성하실 수 없습니다.'
  } else if (value.length >= 20) {
    success = false;
    error = '* 20자까지 작성할 수 있습니다.'
  } else if (value.startsWith(' ')) {
      success = false,
      error = '* 공백으로 시작할 수 없습니다.'
  } else {
    success = true;
    error = ''
  }

  return {
    success: success,
    error: error
  }
};

export const passwordValidation = (value: string) => {
  let success = false;
  let error = '';

  if (value.startsWith(' ')) {
    success = false,
    error = '* 공백으로 시작할 수 없습니다.'
  } else {
    success = true;
    error = '';
  }

  return {
    success: success,
    error: error,
  }
};


export const codeValidation = (value: string) => {
  let success = false;
  let error = '';

  const pattern = /^[a-zA-Zㄱ-ㅎ가-힣0-9]*$/;

  if (!pattern.test(value)) {
    success = false;
    error = '* 특수문자는 작성할 수 없습니다.'
  } else if (value.startsWith(' ')) {
    success = false,
    error = '* 공백으로 시작할 수 없습니다.'
  } else {
    success = true;
    error = '';
  }

  return {
    success: success,
    error: error
  }
};

export const switched = (name: string, value: string) => {
  if (name === 'nickname') return nameValidation(value);
  else if (name === 'ownerId') return idValidation(value);
  else if (name === 'password') return passwordValidation(value);
  else if (name === 'code') return codeValidation(value);
};
