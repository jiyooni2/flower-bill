import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import ROUTES from '../../constants/routes';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.container}>
      <p className={styles.menu} onClick={() => navigate(ROUTES.HOME)}>
        Flower Bill
      </p>
      <hr />
      <p className={styles.menu} onClick={() => navigate(ROUTES.STORE)}>
        스토어
      </p>
      <p className={styles.menu} onClick={() => navigate(ROUTES.BILL)}>
        계산서
      </p>
      <p className={styles.menu} onClick={() => navigate(ROUTES.USER)}>
        내 가게 관리
      </p>
      <p className={styles.menu} onClick={() => navigate(ROUTES.CATEGORY)}>
        카테고리 관리
      </p>
    </nav>
  );
};

export default NavBar;
