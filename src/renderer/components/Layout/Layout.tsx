import NavBar from '../NavBar/NavBar';
import styles from './Layout.module.scss';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Layout;
