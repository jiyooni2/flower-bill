import { loginState } from 'renderer/recoil/states';
import BusinessBar from '../Business/BusinessBar';
import NavBar from '../NavBar/NavBar';
import styles from './Layout.module.scss';
import { useRecoilValue } from 'recoil';
import LoginPage from 'renderer/pages/LoginPage/LoginPage';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  const isLoggedIn = useRecoilValue(loginState);

  return (
    <>
      {!isLoggedIn && <LoginPage />}
      {isLoggedIn && (
        <div className={styles.container}>
          <BusinessBar />
          <div className={styles.navbar}>
            <NavBar />
            <div className={styles.content}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
