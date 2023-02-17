import { TextField } from '@mui/material';
import useInputs from 'renderer/hooks/useInputs';
import { CreateStore } from 'renderer/types';
import Button from '@mui/material/Button';

const CreateStoreForm = () => {
  const [{ businessNumber, address, name, owner }, handleChange] =
    useInputs<CreateStore>({
      businessNumber: '',
      address: '',
      name: '',
      owner: '',
    });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    window.electron.ipcRenderer.sendMessage('create-store', {
      businessNumber: Number(businessNumber),
      address,
      name,
      owner,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-box">
        <div>
          <TextField
            label="사업자등록번호"
            name="businessNumber"
            variant="filled"
            onChange={handleChange}
            value={businessNumber}
          />
        </div>
        <div>
          <TextField
            label="상호"
            name="name"
            variant="filled"
            onChange={handleChange}
            value={name}
          />
        </div>
        <div>
          <TextField
            label="성명"
            name="owner"
            variant="filled"
            onChange={handleChange}
            value={owner}
          />
        </div>
        <div>
          <TextField
            label="사업장 소재지(선택)"
            name="address"
            variant="filled"
            onChange={handleChange}
            value={address}
          />
        </div>
        <Button type="submit" variant="contained">
          제출
        </Button>
      </div>
    </form>
  );
};

export default CreateStoreForm;
