import {
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { data } from '../bank';
import ReplyIcon from '@mui/icons-material/Reply';
import useAddHyphen from 'renderer/hooks/useAddHyphen';
import { useRef, useState } from 'react';
import { Inputs } from '../types';

type IProps = {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
};

const BusinessModalForm = ({ inputs, setInputs }: IProps) => {
  const addHypen = useAddHyphen();
  const [selected, setSelected] = useState<boolean>(false);
  const numberRef = useRef<HTMLInputElement>();
  const nameRef = useRef<HTMLInputElement>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'businessNumber') {
      if (/^[0-9]/.test(value)) {
        setInputs({ ...inputs, businessNumber: value });
      }
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const bankChangeHandler = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setInputs({ ...inputs, bank: value });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          size="small"
          ref={numberRef}
          sx={{ width: '90%' }}
          label="사업자등록번호"
          name="businessNumber"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          placeholder='"-"를 제외하고 작성해주시기 바랍니다.'
          value={addHypen(inputs.businessNumber) || inputs.businessNumber}
          inputProps={{
            maxLength: 12,
            inputMode: 'numeric',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <TextField
          size="small"
          sx={{ width: '44%' }}
          label="상호"
          name="name"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          value={inputs.name}
        />
        <TextField
          size="small"
          ref={nameRef}
          sx={{ width: '45%' }}
          label="성명"
          name="owner"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          value={inputs.owner}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          size="small"
          sx={{ width: '90%' }}
          label="사업장 소재지 (선택)"
          name="address"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          value={inputs.address}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <TextField
          size="small"
          ref={nameRef}
          sx={{ width: '44%' }}
          label="업종 (선택)"
          name="sector"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          value={inputs.sector}
        />
        <TextField
          size="small"
          sx={{ width: '45%' }}
          label="업태 (선택)"
          name="type"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          value={inputs.type}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {!selected ? (
          <Select
            style={{ width: '23%', height: '48px', color: 'black' }}
            value={inputs.bank}
            onChange={bankChangeHandler}
            input={<Input />}
          >
            <MenuItem value="" onClick={() => setSelected(true)}>
              직접 입력
            </MenuItem>
            {data.map((item, index) => (
              <MenuItem value={item.name} key={index}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            size="small"
            label="은행"
            name="bank"
            variant="filled"
            onChange={handleChange}
            helperText={
              <span
                style={{ cursor: 'pointer', fontSize: '12px' }}
                onClick={() => setSelected(false)}
              >
                <ReplyIcon
                  sx={{
                    width: '12px',
                    marginBottom: '-7px',
                    marginLeft: '-3px',
                  }}
                />
                &nbsp; 은행 선택하기
              </span>
            }
            value={inputs.bank}
          />
        )}

        <TextField
          size="small"
          sx={{ width: '31%' }}
          label="계좌번호"
          name="bankNumber"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          value={inputs.bankNumber}
          inputProps={{ maxLength: 15 }}
        />
        <TextField
          size="small"
          sx={{ width: '30%' }}
          label="계좌 소유주 성명"
          name="bankOwner"
          variant="filled"
          onChange={handleChange}
          helperText={' '}
          value={inputs.bankOwner}
        />
      </div>
    </div>
  );
};

export default BusinessModalForm;
