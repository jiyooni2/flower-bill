// import { useNavigate } from 'react-router-dom';
import styles from './BusinessBar.module.scss';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useEffect, useState } from 'react';
import BusinessModal from './NewBusinessModal/BusinessModal';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';
import { useRecoilState, useRecoilValue } from 'recoil';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { Business } from 'main/business/entities/business.entity';
import StoreModal from './StoreModal/StoreModal';

const BusinessBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [storeIsOpen, setStoreIsOpen] = useState<boolean>(false);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [business, setBusiness] = useRecoilState(businessState)
  const token = useRecoilValue(tokenState);

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
          setBusiness(businesses[0])
        } else {
          console.error(error);
        }
      }
    );
    console.log(businesses);
  }, [])

  const clickHandler = (business: Business) => {
    setBusiness(business);
    setStoreIsOpen(true);
  };

  return (
    <>
      <StoreModal isOpen={storeIsOpen} setIsOpen={setStoreIsOpen} />
      <BusinessModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.bar}>
        <div className={styles.container}>
          <div className={styles.content}>
            {businesses.map((business) => (
              <div key={business.id}>
                <div
                  className={styles.box}
                  onClick={() => clickHandler(business)}
                >
                  <span
                    style={{
                      fontSize: '30px',
                      color: 'black',
                      marginTop: '2px',
                    }}
                  >
                    {business.name.slice(0, 1)}
                  </span>
                </div>
              </div>
            ))}
            <div className={styles.addBusiness}>
              <AddRoundedIcon
                sx={{ width: '60%', height: '70%', color: '#73777B' }}
                onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        </div>
        <div className={styles.settingsIcon}>
          <SettingsOutlinedIcon
            sx={{
              color: 'gray',
              marginLeft: '13px',
              marginBottom: '7px',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BusinessBar;
