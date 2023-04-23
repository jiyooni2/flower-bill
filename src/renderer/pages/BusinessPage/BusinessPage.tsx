import styles from './BusinessPage.module.scss';
import { Typography } from '@mui/material';
import Buttons from './components/Buttons';


const BusinessPage = () => {
  return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.infoContent}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '24px',
                marginTop: '20px',
              }}
            >
              사업자 정보
            </Typography>
            <Buttons />
          </div>
        </div>
      </div>
  );
};

export default BusinessPage;
