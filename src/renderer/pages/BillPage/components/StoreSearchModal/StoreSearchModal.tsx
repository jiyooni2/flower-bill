import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import {
  SearchStoreInput,
  SearchStoreOutput,
} from 'main/store/dtos/search-store.dto';
import { businessState, storeState, tokenState } from 'renderer/recoil/states';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Store } from 'main/store/entities/store.entity';
import Modal from 'renderer/components/Modal/Modal';
import SearchIcon from '@mui/icons-material/Search';
import { GetStoresOutput } from 'main/store/dtos/get-stores.dto';
import { Link } from 'react-router-dom';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoreSearchModal = ({ isOpen, setIsOpen }: IProps) => {
  const business = useRecoilValue(businessState);
  const token = useRecoilValue(tokenState);
  const [keyword, setKeyword] = useState<string>('');
  const [storeList, setStoreList] = useState<Store[]>([]);
  const setStore = useSetRecoilState(storeState);
  const [search, setSearch] = useState<boolean>(true);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-stores', {
      token,
      businessId: business.id,
    });
    const getStoreRemover = window.electron.ipcRenderer.on(
      'get-stores',
      ({ stores }: GetStoresOutput) => {
        setStoreList(stores);
      }
    );

    const searchStoreRemover = window.electron.ipcRenderer.on(
      'search-store',
      ({ ok, error, stores }: SearchStoreOutput) => {
        if (ok) {
          setStoreList(stores);
          if (stores.length != undefined && stores.length == 0) {
            setSearch(false);
          } else {
            setSearch(true);
          }
        } else {
          console.error(error);
        }
      }
    );

    return () => {
      getStoreRemover();
      searchStoreRemover();
    };
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
      }

      const searchData: SearchStoreInput = {
        token,
        businessId: business.id,
        keyword: keyword,
        page: 0,
      };

      window.electron.ipcRenderer.sendMessage('search-store', searchData);
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
              {storeList != undefined &&
                storeList?.map((row) => (
                  <TableRow key={row?.name || row.id} sx={{}}>
                    <TableCell component="th" scope="row">
                      <Button
                        sx={{ marginTop: '-5px', marginBottom: '-5px' }}
                        onClick={() => onStoreClick(row)}
                      >
                        선택
                      </Button>
                    </TableCell>
                    <TableCell>{row?.name || ''}</TableCell>
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
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StoreSearchModal;
