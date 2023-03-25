import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import ROUTES from '../../constants/routes';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, passwordCheckState, tokenState } from 'renderer/recoil/states';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';

const NavBar = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState)
  const business = useRecoilValue(businessState)
  const [businesses, setBusinesses] = useRecoilState(businessesState)
  const [hasBusinesses, setHasBusinesses] = useState<boolean>(false);
  const [checked, setChecked] = useRecoilState(passwordCheckState);


  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-businesses', {
      token,
      businessId: business.id,
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

  const businessClickHandler = () => {
    setChecked(false);
    hasBusinesses
      ? navigate(ROUTES.SELLER)
      : window.alert('사업자를 먼저 생성해주세요.');
  }

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
          onClick={() =>
            hasBusinesses
              ? navigate(ROUTES.BILL)
              : window.alert('사업자를 먼저 생성해주세요.')
          }
        >
          계산서 생성
        </p>
        <p
          className={styles.menu}
          onClick={() =>
            hasBusinesses
              ? navigate(ROUTES.BILLS)
              : window.alert('사업자를 먼저 생성해주세요.')
          }
        >
          계산서 목록
        </p>
      </div>
      <div>
        <p className={styles.menuTitle}>상품 관리</p>
        <p
          className={styles.menu}
          onClick={() =>
            hasBusinesses
              ? navigate(ROUTES.PRODUCTS)
              : window.alert('사업자를 먼저 생성해주세요.')
          }
        >
          상품 정보 관리
        </p>
        <p
          className={styles.menu}
          onClick={() => {
            hasBusinesses && hasBusinesses
              ? navigate(ROUTES.CATEGORY)
              : window.alert('사업자를 먼저 생성해주세요.');
          }}
        >
          카테고리 관리
        </p>
      </div>
      <div>
        <p className={styles.menuTitle}>사업 관리</p>
        <p
          className={styles.menu}
          onClick={() =>
            hasBusinesses
              ? navigate(ROUTES.STORE)
              : window.alert('사업자를 먼저 생성해주세요.')
          }
        >
          판매처 관리
        </p>
        <p
          className={styles.menu}
          onClick={() =>
            businessClickHandler()
          }
        >
          사업자 관리
        </p>
      </div>
    </nav>
  );
};

export default NavBar;
