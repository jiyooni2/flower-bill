import { Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { SearchStoreInput, SearchStoreOutput } from 'main/store/dtos/search-store.dto';
import { businessState, storeState, tokenState } from 'renderer/recoil/states';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Store } from 'main/store/entities/store.entity';
import Modal from 'renderer/components/Modal/Modal';
import SearchIcon from '@mui/icons-material/Search';
import { GetStoresOutput } from 'main/store/dtos/get-stores.dto';

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

    const searchData: SearchStoreInput = {
      token,
      businessId: business.id,
      keyword: event.target.value,
      page: 0,
    };

    window.electron.ipcRenderer.sendMessage('search-store', searchData);

    window.electron.ipcRenderer.on(
      'search-store',
      ({ ok, error, stores }: SearchStoreOutput) => {
        if (ok) {
          setStoreList(stores);
        } else {
          console.error(error);
        }
      }
    );
  };

  const onStoreClick = (store: Store) => {
    setStore(store);
    setIsOpen(false);
  };


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div style={{ marginBottom: '15px' }}>
        <SearchIcon sx={{ color: 'gray', fontSize: '15px', marginTop: '15px', marginRight: '5px' }} />
        <Input onChange={handleChange} value={keyword} placeholder='판매처 검색하기' />
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
              {storeList?.map((row) => (
                <TableRow key={row?.name} sx={{}}>
                  <TableCell component="th" scope="row">
                    <Button
                      sx={{ marginTop: '0px', marginBottom: '0px' }}
                      onClick={() => onStoreClick(row)}
                    >
                      선택
                    </Button>
                  </TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.businessNumber}</TableCell>
                  <TableCell>{row.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
};

export default StoreSearchModal;
