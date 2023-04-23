import { Category } from "main/category/entities/category.entity";
import { Inputs } from "./types";

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


export const addLogic = (
  item: Category,
  name: string,
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>,
  inputs: Inputs,
  nameInputRef: React.MutableRefObject<HTMLInputElement>,
  categories: Category[])  => {
  setInputs({...inputs, categoryId: '', categoryName: '', levelName: '', parentCategoryName: ''})

    switch (name) {
      case 'add':
        setInputs({...inputs, clicked: false, addNew: true})

        switch (item.level) {
          case null: setInputs({...inputs, levelName: '대분류'})
          case 1: setInputs({...inputs, levelName: '중분류'})
          case 2: setInputs({...inputs, levelName: '소분류'})
        }

        if (nameInputRef.current !== null) nameInputRef.current.focus();

        if (item) {
          setInputs({...inputs, parentCategoryName: item.name, parentCategoryId: item.id, categoryId: (categories.length + 1).toString()})
        } else {
          setInputs({...inputs, parentCategoryName: '', parentCategoryId: null, categoryId: (categories.length + 1).toString()})
        }
        return inputs

      case 'item':
        setInputs({...inputs, clicked: true, addNew: false})

        let name = ''
        switch (item.level) {
          case 1: name = '대분류'
          case 2: name = '중분류'
          case 3: name = '소분류'
        }
        setInputs({...inputs, levelName: name})


        if (item) {
          categories.map((cat) => {
            if (cat.id == item.parentCategoryId) {
              setInputs({...inputs, categoryName: cat.name})
            }
          });

          setInputs({
            ...inputs,
            categoryId: `${item.id}`,
          })
        } else {
          setInputs({
            ...inputs,
            categoryId: null,
            parentCategoryName: '',
            categoryName: item.name
          })
        }
        return inputs
    }
}
