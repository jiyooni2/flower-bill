import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './BusinessPage.module.scss'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { Business } from 'main/business/entities/business.entity';
import { useRecoilState } from 'recoil';
import { businessState } from 'renderer/recoil/states';
import PasswordConfirmModal from './components/ConfirmModal/PasswordConfirmModal';

const BUSINESS: Business =
  {
    name: '이름',
    businessNumber: 101010101n,
    businessOwnerName: '오너이름',
    address: '서울시 종로구',
    owner: null,
    ownerId: null,
  };

const BuisnessPage = () => {
  // const [currentBusiness, setCurrentBusiness] = useRecoilState(businessState)
  const [currentBusiness, setCurrentBusiness] = useState<Business>(BUSINESS);
  const [businessNumber, setBusinessNumber] = useState<string>(currentBusiness.businessNumber.toString());
  const [name, setName] = useState<string>(currentBusiness.name);
  const [businessOwnerName, setBusinessOwnerName] = useState<string>(currentBusiness.businessOwnerName)
  const [address, setAddress] = useState<string>(currentBusiness.address);
  const [clicked, setClicked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const deleteDataHandler = () => {
    if (window.confirm('정말 삭제하시겠습니까?')){
      setIsOpen(true)
    }
  };

  console.log(currentBusiness)

  const updateDataHandler = () => {
    currentBusiness['name'] = name;
    currentBusiness['businessNumber'] = BigInt(businessNumber);
    currentBusiness['businessOwnerName'] = businessOwnerName;
    currentBusiness['address'] = address;
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>, dataName: string) => {
    const value = event.target.value;

    if (dataName === 'number') setBusinessNumber(value);
    else if (dataName === 'name') setName(value);
    else if (dataName === 'owner') setBusinessOwnerName(value);
    else if (dataName === 'address') setAddress(value);
  };

  return (
    <>
      <PasswordConfirmModal isOpen={isOpen} setIsOpen={setIsOpen} />
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
            <div className={styles.list}>
              <div>
                <div>
                  <div className={styles.item}>
                    <p className={styles.labels}>사업자 번호</p>
                    <input
                      value={businessNumber}
                      className={styles.dataInput}
                      onChange={(event) => changeHandler(event, 'number')}
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>사업장 이름</p>
                    <input
                      value={name}
                      className={styles.dataInput}
                      onChange={(event) => changeHandler(event, 'name')}
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>소유자 이름</p>
                    <input
                      value={businessOwnerName}
                      className={styles.dataInput}
                      onChange={(event) => changeHandler(event, 'owner')}
                    />
                  </div>
                  <div className={styles.item}>
                    <p className={styles.labels}>사업장 주소</p>
                    <input
                      value={address}
                      className={styles.dataInput}
                      onChange={(event) => changeHandler(event, 'address')}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.buttonList}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginLeft: '40px' }}
                    color="error"
                    onClick={deleteDataHandler}
                  >
                    삭제
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginRight: '10px' }}
                    onClick={updateDataHandler}
                  >
                    수정
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuisnessPage;
