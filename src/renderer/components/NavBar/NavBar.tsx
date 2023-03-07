import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import ROUTES from '../../constants/routes';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.container}>
      <p className={styles.title} onClick={() => navigate(ROUTES.HOME)}>
        Flower Bill
      </p>
      <hr />
      <div>
        <p className={styles.menuTitle}>계산서</p>
        <p className={styles.menu} onClick={() => navigate(ROUTES.BILL)}>
          계산서 생성
        </p>
        <p className={styles.menu} onClick={() => navigate(ROUTES.BILLS)}>
          계산서 목록
        </p>
      </div>
      <div>
        <p className={styles.menuTitle}>상품 관리</p>
        <p className={styles.menu} onClick={() => navigate(ROUTES.PRODUCTS)}>
          상품 정보 관리
        </p>
        <p className={styles.menu} onClick={() => navigate(ROUTES.CATEGORY)}>
          카테고리 관리
        </p>
      </div>
      <div>
        <p className={styles.menuTitle}>사업 관리</p>
        <p className={styles.menu} onClick={() => navigate(ROUTES.STORE)}>
          판매처 관리
        </p>
        <p className={styles.menu} onClick={() => navigate(ROUTES.SELLER)}>
          사업자 관리
        </p>
      </div>
    </nav>
  );
};

export default NavBar;
