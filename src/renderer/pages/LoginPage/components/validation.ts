import { Inputs } from "../types";

export const nameValidation = (value: string) => {
  let success;
  let error;
  const pattern = /\s/g;
  if (pattern.test(value)) {
    success = false;
    error = '* 공백으로 시작할 수 없습니다.'
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

  if (value.length > 16) {
    success = false;
    error = '* 16글자 이상 작성하실 수 없습니다.'
  } else if (value.startsWith(' ')) {
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

  if (value.length > 8) {
    success = false;
    error = '* 8글자 이상 작성하실 수 없습니다.'
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

export const signUpSubmitValidation = (inputs: Inputs) => {
  let ownerId = '';
  let nickname = '';
  let password = '';
  let code = '';
  if (!inputs.ownerId) ownerId = '* 아이디가 입력되지 않았습니다.'
  if (!inputs.nickname) nickname = '* 닉네임이 입력되지 않았습니다.'
  if (!inputs.password) password = '* 비밀번호가 입력되지 않았습니다.'
  if (!inputs.code) code = '* 비밀번호 변경 코드가 입력되지 않았습니다.'

  if (inputs.password.length < 8) {
    // setErrors({...errors, password: '8자 이상 작성해야합니다.'});
    password = '8자 이상 작성해야합니다.'
    return;
  } else if (inputs.password.length > 16) {
    // setErrors({...errors, password: '16장 이상 작성 불가합니다.'});
    password = '16장 이상 작성 불가합니다.'
    return;
  }

  return {
    ownerId: ownerId,
    nickname: nickname,
    password: password,
    code: code,
  }
};

export const switched = (name: string, value: string) => {
  if (name === 'nickname') return nameValidation(value);
  else if (name === 'ownerId') return idValidation(value);
  else if (name === 'password') return passwordValidation(value);
  else if (name === 'code') return codeValidation(value);
};
