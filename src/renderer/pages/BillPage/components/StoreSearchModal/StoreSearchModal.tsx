import { Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { SearchStoreInput, SearchStoreOutput } from 'main/store/dtos/search-store.dto';
import { businessState, storeState, storesState, tokenState } from 'renderer/recoil/states';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Store } from 'main/store/entities/store.entity';
import Modal from 'renderer/components/Modal/Modal';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SearchIcon from '@mui/icons-material/Search';
import { GetStoresOutput } from 'main/store/dtos/get-stores.dto';
import { Link } from 'react-router-dom';
import styles from './StoreSearchModal.module.scss'

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoreSearchModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState)
  const token = useRecoilValue(tokenState);
  const [keyword, setKeyword] = useState<string>('');
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [store, setStore] = useRecoilState(storeState);
  const [search, setSearch] = useState<boolean>(true)

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-stores', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on('get-stores',
    (args: GetStoresOutput) => {
      setStoreList(args.stores as Store[]);
    });
  }, []);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      if (keyword == '') {
          window.electron.ipcRenderer.sendMessage('get-stores', {
            token,
            businessId: business.id,
          });
          window.electron.ipcRenderer.on(
            'get-stores',
            (args: GetStoresOutput) => {
              setStoreList(args.stores as Store[]);
            }
          );
        }

      const searchData: SearchStoreInput = {
        token,
        businessId: business.id,
        keyword: keyword,
        page: 0,
      };

      window.electron.ipcRenderer.sendMessage('search-store', searchData);

      window.electron.ipcRenderer.on(
        'search-store',
        ({ ok, error, stores }: SearchStoreOutput) => {
          if (ok) {
            setStoreList(stores);
            if (stores.length == 0) setSearch(false)
            else setSearch(true)
          } else {
            console.log(error);
          }
        }
      );
    }
  };

  const onStoreClick = (store: Store) => {
    setStore(store);
    setIsOpen(false);
  };


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        style={{
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <SearchIcon
            sx={{
              color: 'gray',
              fontSize: '15px',
              marginTop: '15px',
              marginRight: '5px',
            }}
          />
          <Input
            onChange={handleChange}
            value={keyword}
            placeholder="판매처 검색하기"
            onKeyDown={keyHandler}
          />
        </div>
        <div
          style={{
            marginTop: '10px',
            marginRight: '15px',
            fontSize: '15px',
            color: 'darkslateblue',
            fontWeight: '450',
          }}
        >
          <Link to={'/store'}>
            <Button
              variant="contained"
              size="small"
              color="info"
              sx={{ width: '120px' }}
            >
              판매처 추가하기
            </Button>
          </Link>
        </div>
      </div>
      <div style={{ height: '370px' }}>
        <TableContainer sx={{ overflow: 'hidden', height: '95%' }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>판매처명</TableCell>
                <TableCell>사업자</TableCell>
                <TableCell>사업자 번호</TableCell>
                <TableCell>판매처 주소</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storeList.map((row) => (
                <TableRow key={row.name} sx={{}}>
                  <TableCell component="th" scope="row">
                    <Button
                      sx={{ marginTop: '-5px', marginBottom: '-5px' }}
                      onClick={() => onStoreClick(row)}
                    >
                      선택
                    </Button>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.businessNumber}</TableCell>
                  <TableCell>{row.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!search && (
          <div
            style={{
              color: 'gray',
              fontSize: '14px',
            }}
          >
            <p
              style={{
                marginTop: '-200px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              찾으시는 판매처가 존재하지 않습니다.{' '}
            </p>
            {/* <br /> */}
            {/* <p>
              <Link to={'/store'} className={styles.addSeller}>
                판매처 추가하기
              </Link>
            </p> */}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StoreSearchModal;
