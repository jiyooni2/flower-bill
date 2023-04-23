export const numberValidation = (value:string) => {
  let error = '';
  let success = false;

      const numPattern = /^[0-9]*$/;
      if (!numPattern.test(value)) {
          success= false;
          error= '숫자 외의 문자는 작성하실 수 없습니다.';
      } else if (value.startsWith('0')) {
          success = false;
          error = '첫 번쨰 자리는 0이 될 수 없습니다.';
      } else {
          success = true;
          error = '';
      }
    return {
      success: success,
      error: error
    }
};


export const nameValidation = (value:string) => {
  let success = false;
  let error = '';

      const namePattern = /^[ㄱ-ㅎ가-힣0-9a-zA-Z\s]*$/;
      if (!namePattern.test(value)) {
          success= false;
          error= '공백 외의 특수문자는 작성하실 수 없습니다.';
      } else if (value.startsWith(' ')) {
          success= false;
          error= '첫 번째 자리는 공백이 될 수 없습니다.';
      } else if (value.length > 30) {
          success= false;
          error= '최대 30글자까지 작성하실 수 있습니다.';
      } else {
          success= true;
          error= '';
      }
    return {
      success: success,
      error: error,
    }
}


export const ownerValidation = (value: string) => {
  let success = false;
  let error = '';
      const ownerPattern = /^[ㄱ-ㅎ가-힣a-zA-Z]*$/;
      if (!ownerPattern.test(value)) {
          success= false;
          error= '한글, 영문 이외의 문자는 성함에 포함될 수 없습니다.';
      } else {
          success= true;
          error= '';
      }

    return {
      success: success,
      error: error
    }
}


export const addressValidation = (value: string) => {
  let success = false;
  let error = '';

      const addressPattern = /^[ㄱ-ㅎ가-힣a-zA-Z_-]*$/;
      if (!addressPattern.test(value)) {
          success= false;
          error= '특수문자는 -와 _만 입력 가능합니다.';
      } else {
          success= true;
          error= '';
      }

    return {
      success: success,
      error: error,
    }
}


export const submitValidation = ( storeNumber: string, storeName: string, owner: string, address: string) => {
  const error = {
    storeNumber: '',
    storeName: '',
    owner: '',
    address: '',
  }

  if (!storeNumber) {
    error['storeNumber'] = '사업자 번호가 입력되지 않았습니다.'
  }

  if (!storeName) {
    error['storeName'] = '판매처명이 입력되지 않았습니다.'
  }

  if (!owner) {
    error['owner'] = '성함이 입력되지 않았습니다.'
  } else if (owner.length < 2) {
    error['owner'] = '소유자 성명은 2글자 이상이어야 합니다.'
  }

  if (!address) {
    error['address'] = '사업자 주소가 입력되지 않았습니다.'
  } else if (address.length < 3) {
    error['address'] = '사업자 주소는 3글자 이상이어야 합니다.'
  }

  return error
}



export const switched = (name: string, value: string) => {
  if (name === 'storeNumber') return numberValidation(value);
  else if (name === 'storeName') return nameValidation(value);
  else if (name === 'owner') return ownerValidation(value);
  else if (name === 'address') return addressValidation(value);
}
