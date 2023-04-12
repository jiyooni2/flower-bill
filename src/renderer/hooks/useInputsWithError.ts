import { useState } from 'react';

const useInputsWithError = <T = Record<string, unknown>>(
  initialForm: T,
  initialErrorForm: T
): [
  T,
  (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  React.Dispatch<React.SetStateAction<T>>,
  T,
  React.Dispatch<React.SetStateAction<T>>
] => {
  const [form, setForm] = useState<T>(initialForm);
  const [errors, setErrors] = useState<T>(initialErrorForm);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return [form, onChange, setForm, errors, setErrors];
};

export default useInputsWithError;
