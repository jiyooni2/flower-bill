// import { useNavigate } from 'react-router-dom';
import styles from './BusinessBar.module.scss';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useState } from 'react';
import BusinessModal from './NewBusinessModal/BusinessModal';

const BusinessBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <BusinessModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.bar}>
        <div className={styles.container}>
          <div className={styles.content}>
            {/* data.map(() => (<div></di>)) */}
            <div className={styles.box}>
              <img src="https://raw.githubusercontent.com/hashdog/node-identicon-github/master/examples/images/github.png" />
            </div>
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
