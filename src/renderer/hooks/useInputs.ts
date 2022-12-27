import { useState } from 'react';

const useInputs = <T = Record<string, unknown>>(
  initialForm: T
): [
  T,
  (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  React.Dispatch<React.SetStateAction<T>>
] => {
  const [form, setForm] = useState<T>(initialForm);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return [form, onChange, setForm];
};

export default useInputs;
