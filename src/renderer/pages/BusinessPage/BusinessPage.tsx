import Button from '@mui/material/Button';
import styles from './BusinessPage.module.scss';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const BuisnessPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Button
            variant="contained"
            onClick={() => navigate('/business')}
            sx={{
              height: '39px',
              width: '20%',
              backgroundColor: 'ghostwhite',
              color: '#228af2',
              '&:hover': {
                background: '#651fff',
                opacity: '0.9',
                color: 'white',
              },
            }}
          >
            사업자 정보 수정
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/password-change')}
            sx={{
              height: '39px',
              width: '20%',
              backgroundColor: 'ghostwhite',
              color: '#228af2',
              '&:hover': {
                background: '#651fff',
                opacity: '0.9',
                color: 'white',
              },
            }}
          >
            비밀번호 변경
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuisnessPage;
