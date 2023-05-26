import { Button } from "@mui/material";
import React from "react";
import { ButtonProps } from './UpdatePage.interface';

const Buttons = ({
  setIsSearchStoreOpen,
  setIsDiscountOpen,
  setIsMemoOpen,
  setIsBillOpen,
}: ButtonProps) => {
  const billClickHandler = () => {
    setIsBillOpen(true);
  };

  return (
    <>
      <div
        style={{
          marginTop: '15px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          gap: '10px',
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: '40%',
            height: '33px',
            backgroundColor: 'ghostwhite',
            opacity: '0.9',
            marginleft: '20px',
            color: '#228af2',
            '&:hover': {
              background: '#6b5fb9',
              opacity: '0.9',
              color: 'lightskyblue',
            },
          }}
          onClick={() => setIsSearchStoreOpen(true)}
        >
          판매처
        </Button>
        <Button
          variant="contained"
          onClick={() => setIsDiscountOpen(true)}
          sx={{
            width: '40%',
            height: '33px',
            backgroundColor: 'ghostwhite',
            color: '#228af2',
            '&:hover': {
              background: '#6b5fb9',
              opacity: '0.9',
              color: 'lightskyblue',
            },
          }}
        >
          판매가
        </Button>
        <Button
          variant="contained"
          onClick={() => setIsMemoOpen(true)}
          sx={{
            width: '40%',
            height: '33px',
            backgroundColor: 'ghostwhite',
            color: '#228af2',
            '&:hover': {
              background: '#6b5fb9',
              opacity: '0.9',
              color: 'lightskyblue',
            },
          }}
        >
          메모
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={billClickHandler}
          sx={{
            height: '33px',
            width: '100%',
            marginTop: '10px',
            backgroundColor: '#228bf2',
            color: '#e8f8e2',
          }}
        >
          계산서 수정하기
        </Button>
      </div>
    </>
  );
};

export default Buttons;
