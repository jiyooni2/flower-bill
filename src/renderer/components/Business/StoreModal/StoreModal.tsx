import { CreateBusinessOutput } from 'main/business/dtos/create-business.dto';
import Modal from './Modal';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, storeState, tokenState } from 'renderer/recoil/states';
import { Business } from 'main/business/entities/business.entity';
import { useEffect, useState } from 'react';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { Store } from 'main/store/entities/store.entity';
import { GetStoresOutput } from 'main/store/dtos/get-stores.dto';
import styles from './StoreModal.module.scss'

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoreModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [store, setStore] = useRecoilState(storeState);
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStore, setFilteredStore] = useState<Store[]>(stores);


  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-stores', {
      page: 1,
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-stores',
      (args: GetStoresOutput) => {
        setStores(args.stores as Store[])
      }
    );

    stores.map((store) => {
      if (store.businessNumber === business.businessNumber) {
        setFilteredStore([...filteredStore, store])
      }
    })
  }, [])

  const changeStoreHandler = (store: Store) => {
    setStore(store)
  };


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6">사업자 등록하기</Typography>
      </div>
      <div style={{ height: '80%' }}>
        {/* <Button
          type="submit"
          variant="text"
          sx={{ marginTop: '30px', float: 'right', marginRight: '5px' }}
        >
          제출하기
        </Button> */}
        <TableContainer sx={{ width: '100%', height: '100%' }}>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    borderBottom: '1.5px solid black',
                    fontSize: '14px',
                    backgroundColor: 'lightgray',
                  },
                }}
              >
                <TableCell align="left" sx={{ width: '10%' }}></TableCell>
                <TableCell component="th" align="left">
                  가게명
                </TableCell>
                <TableCell component="th" align="left">
                  사업자
                </TableCell>
                {/* <TableCell component="th" align="left" sx={{ width: '30%' }}>
                    가게 주소
                  </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStore &&
                filteredStore.length > 0 &&
                filteredStore.map((store) => (
                  <TableRow
                    key={store.businessNumber}
                    className={styles.dataRow}
                    // onClick={(event) => changeDataHandler(event, store)}
                    sx={{
                      '& th': {
                        fontSize: '14px',
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      align="left"
                      sx={{ width: '30%', color: 'blue', cursor: 'pointer' }}
                      onClick={() => changeStoreHandler(store)}
                    >
                      {/* <Button>선택</Button> */}
                      선택
                    </TableCell>
                    <TableCell component="th" align="left">
                      {store.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      align="left"
                      className={styles.cutText}
                    >
                      {store.owner}
                    </TableCell>
                    {/* <TableCell
                        component="th"
                        align="left"
                        className={styles.cutText}
                        sx={{ width: '30%' }}
                      >
                        {store.address}
                      </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {stores && stores.length == 0 && (
          <div className={styles.noResult}>
            <div>
              <h3>결과가 없습니다.</h3>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StoreModal;
