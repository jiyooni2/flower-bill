// import { useNavigate } from 'react-router-dom';
import styles from './BusinessBar.module.scss';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useEffect, useState } from 'react';
import BusinessModal from './NewBusinessModal/BusinessModal';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';
import { useRecoilState, useRecoilValue } from 'recoil';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { Business } from 'main/business/entities/business.entity';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const BusinessBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [business, setBusiness] = useRecoilState(businessState)
  const token = useRecoilValue(tokenState);
  const [clicked, setClicked] = useState<boolean>(false);
  const [clickedData, setClickedData] = useState({
    name: '',
  })

  useEffect(() => {
    let businessId;
    if (business) {
      businessId = business.id
    } else {
      businessId = 1;
    }
    window.electron.ipcRenderer.sendMessage('get-businesses', {
      token,
      businessId: businessId,
    });

    window.electron.ipcRenderer.on(
      'get-businesses',
      ({ ok, error, businesses }: GetBusinessesOutput) => {
        if (ok) {
          setBusinesses(businesses);
          setBusiness(businesses[0])
          setClicked(true);
          setClickedData({
            name: businesses[0].name,
          });
        } else {
          console.error(error);
        }
      }
    );
  }, [])


  const clickHandler = (item: Business) => {
    setBusiness(item)
    setClicked(true);
    setClickedData({
      name: item.name
    })
  };

  return (
    <>
      <BusinessModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.bar}>
        <div className={styles.container}>
          <Link to={'/'}>
            <div className={styles.content}>
              {businesses.map((business) => (
                <div key={business.id}>
                  <div>
                    <Button
                      className={
                        clicked && clickedData.name == business.name
                          ? `${styles.commonBox} ${styles.clickedBox}`
                          : `${styles.commonBox} ${styles.box}`
                      }
                       onClick={() => clickHandler(business)}
                    >
                      {business?.name.slice(0, 1)}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Link>
          <div className={styles.addBusiness}>
            <AddRoundedIcon
              sx={{
                width: '80%',
                height: '70%',
                color: '#73777B',
                marginLeft: '5px',
                cursor: 'pointer',
                marginTop: '25px',
              }}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessBar;
