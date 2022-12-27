import { useNavigate } from 'react-router-dom';
import icon from '../../../../assets/icon.svg';
import ROUTES from '../../constants/routes';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <div className="Hello">
        <button type="button" onClick={() => navigate(ROUTES.STORE)}>
          가게 등록
        </button>
        <button type="button" onClick={() => navigate(ROUTES.BILL)}>
          계산서
        </button>
      </div>
    </div>
  );
};

export default HomePage;
