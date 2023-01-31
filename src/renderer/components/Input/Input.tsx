import styles from './Input.module.scss';
import { ChangeEvent, useState } from 'react'

interface propsType {
  placeholderText?: string;
  inputName: string;
  setValue?: string;
}

const Input = ({ placeholderText, inputName, setValue }:propsType) => {
  const [inputText, setInputText] = useState<string>("");

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <>
      {
        setValue && setValue !== '' ? (
          <input
            name={inputName}
            value={setValue}
            placeholder={placeholderText}
            readOnly
          />
        ) : (
          <input
            onChange={handleTextChange}
            name={inputName}
            value={inputText}
            placeholder={placeholderText}
          />
        )
      }
   </>
  );
};

export default Input;

