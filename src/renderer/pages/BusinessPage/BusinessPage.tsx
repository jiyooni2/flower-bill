import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './BusinessPage.module.scss'
import { Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';
import PasswordConfirmModal from './components/ConfirmModal/PasswordConfirmModal';
import { LoginOutput } from 'auth/dtos/login.dto';
import { UpdateBusinessInput, UpdateBusinessOutPut } from 'main/business/dtos/update-busiess.dto';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { Business } from 'main/business/entities/business.entity';

const BuisnessPage = () => {
  const business = useRecoilValue(businessState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const token = useRecoilValue(tokenState);
  const [loginInfo, setLoginInfo] = useState({});
  const [businessNumber, setBusinessNumber] = useState<number>(
    business.businessNumber
  );
  const [name, setName] = useState<string>(business.name);
  const [businessOwnerName, setBusinessOwnerName] = useState<string>(
    business.businessOwnerName
  );
  const [address, setAddress] = useState<string>(business.address);
  const [isOpen, setIsOpen] = useState<boolean>(false);


  const deleteDataHandler = () => {
    if (window.confirm('정말 삭제하시겠습니까?')){
      setIsOpen(true)
    }
  };

  const updateDataHandler = () => {
    if (window.confirm('정말 수정하시겠습니까?')){
      const newData: UpdateBusinessInput = {
        businessNumber,
        address,
        name,
        businessOwnerName,
        token,
        businessId: business.id,
      };

      window.electron.ipcRenderer.sendMessage('update-business', {
        ...newData,
      });

      window.electron.ipcRenderer.on(
        'update-business',
        ({ ok, error }: UpdateBusinessOutPut) => {
          if (ok) {
            window.electron.ipcRenderer.sendMessage('get-businesses', {
              token,
              businessId: business.id,
            });
            window.electron.ipcRenderer.on(
              'get-businesses',
              (args: GetBusinessesOutput) => {
                setBusinesses(args.businesses as Business[]);
              }
            );
          }
          if (error) {
            console.log(error);
          }
        }
      );
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>, dataName: string) => {
    const value = event.target.value;

    if (dataName === 'number') setBusinessNumber(parseInt(value));
    else if (dataName === 'name') setName(value);
    else if (dataName === 'owner') setBusinessOwnerName(value);
    else if (dataName === 'address') setAddress(value);
  };

  return (
    <>
      <PasswordConfirmModal isOpen={isOpen} setIsOpen={setIsOpen} purpose="enter" />
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
