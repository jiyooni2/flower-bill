import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import ROUTES from '../../constants/routes';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.container}>
      <h1>Flower Bill</h1>
      <hr />
      <p className={styles.menu} onClick={() => navigate(ROUTES.STORE)}>
        스토어
      </p>
      <p className={styles.menu} onClick={() => navigate(ROUTES.BILL)}>
        계산서
      </p>
      <p className={styles.menu} onClick={() => navigate(ROUTES.HOME)}>
        내 가게 관리
      </p>
    </nav>
  );
};

export default NavBar;
