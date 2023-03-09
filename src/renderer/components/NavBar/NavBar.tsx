import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import ROUTES from '../../constants/routes';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessesState, tokenState } from 'renderer/recoil/states';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';

const NavBar = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState)
  const [businesses, setBusinesses] = useRecoilState(businessesState)
  const [hasBusinesses, setHasBusinesses] = useState<boolean>(false);

  console.log(hasBusinesses)

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-businesses', {
      token,
      businessId: 1,
    });

    window.electron.ipcRenderer.on(
      'get-businesses',
      ({ ok, error, businesses }: GetBusinessesOutput) => {
        if (ok) {
          setBusinesses(businesses);
          if (businesses.length == 0) setHasBusinesses(false);
          else setHasBusinesses(true);
        } else {
          console.error(error);
        }
      }
    );
  }, []);

  return (
    <nav className={styles.container}>
      <p className={styles.title} onClick={() => navigate(ROUTES.HOME)}>
        Flower Bill
      </p>
      <hr />
      <div>
        <p className={styles.menuTitle}>계산서</p>
        <p
          className={styles.menu}
          onClick={() => (hasBusinesses ? navigate(ROUTES.BILL) : undefined)}
        >
          계산서 생성
        </p>
        <p
          className={styles.menu}
          onClick={() => (hasBusinesses ? navigate(ROUTES.BILLS) : undefined)}
        >
          계산서 목록
        </p>
      </div>
      <div>
        <p className={styles.menuTitle}>상품 관리</p>
        <p
          className={styles.menu}
          onClick={() =>
            hasBusinesses ? navigate(ROUTES.PRODUCTS) : undefined
          }
        >
          상품 정보 관리
        </p>
        <p
          className={styles.menu}
          onClick={() => {
            hasBusinesses && hasBusinesses
              ? navigate(ROUTES.CATEGORY)
              : undefined;
          }}
        >
          카테고리 관리
        </p>
      </div>
      <div>
        <p className={styles.menuTitle}>사업 관리</p>
        <p
          className={styles.menu}
          onClick={() => (hasBusinesses ? navigate(ROUTES.STORE) : undefined)}
        >
          판매처 관리
        </p>
        <p
          className={styles.menu}
          onClick={() => (hasBusinesses ? navigate(ROUTES.SELLER) : undefined)}
        >
          사업자 관리
        </p>
      </div>
    </nav>
  );
};

export default NavBar;
