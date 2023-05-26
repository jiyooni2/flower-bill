import { GetBillsOutput } from 'main/bill/dtos/get-bills.dto';
import { Bill } from 'main/bill/entities/bill.entity';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  billListState,
  businessState,
  tokenState,
} from 'renderer/recoil/states';
import styles from './BillsPage.module.scss';
import {
  Pagination,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { toast } from 'react-toastify';
import Body from './UpdateBillPage/TableBody';

const BillsPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [bills, setBills] = useRecoilState(billListState);
  const [page, setPage] = useState(0);
  const [alert, setAlert] = useState({ success: '', error: '' });

  useEffect(() => {
    if (alert.error && !alert.success) {
      if (alert.error.startsWith('네트워크')) {
        toast.error(alert.error.split('네트워크')[1], {
          autoClose: 10000,
          position: 'top-right',
          hideProgressBar: true,
        });
      } else {
        toast.error(alert.error, {
          autoClose: 3000,
          position: 'top-right',
        });
      }
    } else if (alert.success && !alert.error) {
      toast.success(alert.success, {
        autoClose: 2000,
        position: 'top-right',
      });
    }
  }, [alert]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-bills', {
      token,
      businessId: business.id,
      page: page,
    });
    window.electron.ipcRenderer.on('get-bills', (args: GetBillsOutput) => {
      setBills(args.bills as Bill[]);
    });
  }, []);

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    console.log(value);
    setPage(value);
  };

  let LAST_PAGE = 1;
  if (bills != undefined) {
    LAST_PAGE =
      bills?.length % 8 === 0
        ? Math.round(bills?.length / 8)
        : Math.floor(bills?.length / 8) + 1;
  } else if (bills == null) {
    LAST_PAGE = 1;
  }

  return (
    <>
      <div className={styles.container}>
        <div style={{ marginTop: '-1.5%', marginBottom: '25px' }}>
          <input
            type="search"
            // value={name}
            // onChange={filter}
            placeholder="판매처 검색"
            className={styles.searchInput}
          />
        </div>
        <Paper sx={{ width: '100%', height: '72vh', marginBottom: '30px' }}>
          <TableContainer>
            <Table stickyHeader size="small" aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell width={'10%'} />
                  <TableCell>발행 날짜</TableCell>
                  <TableCell>수정 날짜</TableCell>
                  <TableCell>판매처</TableCell>
                  <TableCell>구매처</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <Body setAlert={setAlert} page={page} />
            </Table>
          </TableContainer>
        </Paper>
        <Pagination count={LAST_PAGE} page={page} onChange={handleChangePage} />
      </div>
    </>
  );
};

export default BillsPage;
