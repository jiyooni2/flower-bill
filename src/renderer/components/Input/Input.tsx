import styles from './Input.module.scss';
import { ChangeEvent, useState } from 'react'

interface propsType {
  placeholderText?: string;
  inputName: string;
}

const Input = ({ placeholderText, inputName }:propsType) => {
  const [inputText, setInputText] = useState<string>("");

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <input
      onChange={handleTextChange}
      name={inputName}
      value={inputText}
      placeholder={placeholderText}
    />
  );
};

export default Input;

