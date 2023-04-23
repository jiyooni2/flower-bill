import { Button } from "@mui/material";
import React from "react";


type IProps = {
  setIsSearchStoreOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDiscountOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMemoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBillOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Buttons = ({ setIsSearchStoreOpen, setIsDiscountOpen, setIsMemoOpen, setIsBillOpen } : IProps) => {
  const billClickHandler = () => {
    setIsBillOpen(true);
  };

  return (
    <>
      <div
              style={{
                marginTop: '25px',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                gap: '10px',
              }}
            >
              <Button
                variant="contained"
                sx={{
                  height: '38px',
                  width: '110%',
                  backgroundColor: 'ghostwhite',
                  opacity: '0.9',
                  marginleft: '20px',
                  color: '#228af2',
                  '&:hover': {
                    background: '#651fff',
                    opacity: '0.9',
                    color: 'white',
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
                  height: '38px',
                  width: '110%',
                  backgroundColor: 'ghostwhite',
                  color: '#228af2',
                  '&:hover': {
                    background: '#651fff',
                    opacity: '0.9',
                    color: 'white',
                  },
                }}
              >
                판매가
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsMemoOpen(true)}
                sx={{
                  height: '38px',
                  width: '100%',
                  backgroundColor: 'ghostwhite',
                  color: '#228af2',
                  '&:hover': {
                    background: '#651fff',
                    opacity: '0.9',
                    color: 'white',
                  },
                }}
              >
                메모
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '-7px',
              }}
            >
              <Button
                variant="contained"
                onClick={billClickHandler}
                sx={{
                  height: '37px',
                  width: '100%',
                  marginTop: '10px',
                  backgroundColor: '#228bf2',
                  color: '#e8f8e2',
                }}
              >
                계산서 생성
              </Button>
            </div>
    </>
  )
};

export default Buttons;
