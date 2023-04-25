const useAddComma = () => {
  const addComma = (value: string) => {
    const pattern = /^[0-9,]/;
    let numValue;
    if (!pattern.test(value) && value) return;
    if (value === '') return numValue = ''
    if (pattern.test(value)) {
      numValue = value.replaceAll(',', '');
      numValue = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return numValue;
  }
  return addComma;
}

export default useAddComma;
