import './StorePage.scss';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Store } from 'renderer/types';
import useInputs from '../../hooks/useInputs';
import ROUTES from '../../constants/routes';

interface IForm extends Omit<Store, 'bills' | 'businessNumber'> {
  businessNumber: string;
}

const StorePage = () => {
  const navigate = useNavigate();
  const [{ businessNumber, address, name, owner }, handleChange, setForm] =
    useInputs<IForm>({
      businessNumber: '',
      address: '',
      name: '',
      owner: '',
    });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <button type="button" onClick={() => navigate(ROUTES.HOME)}>
        뒤로가기
      </button>
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
          <button type="submit">제출</button>
        </div>
      </form>
    </div>
  );
};

export default StorePage;
