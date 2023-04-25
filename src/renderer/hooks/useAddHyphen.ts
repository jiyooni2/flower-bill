const useAddHyphen = () => {
  const addHypen = (value: string) => {
    let formatNum;
    try{
      if (value.length == 10) {
        formatNum = value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
      }
    } catch(e) {
      formatNum = value;
      console.log(e);
    }
    return formatNum;
  };

  return addHypen;
};

export default useAddHyphen;
