import { GetBillsOutput } from "main/bill/dtos/get-bills.dto";
import { Bill } from "main/bill/entities/bill.entity";
import { Suspense, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { billsState, businessState, businessesState, storesState, tokenState } from "renderer/recoil/states";
import styles from './BillsPage.module.scss'
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

const BillsPage = () => {
  const token = useRecoilValue(tokenState)
  const business = useRecoilValue(businessState)
  const businesses = useRecoilValue(businessesState)
  const stores = useRecoilValue(storesState)
  const [bills, setBills] = useRecoilState(billsState)
  const [page, setPage] = useState(0);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-bills', {
      token,
      businessId: business.id,
      page: page,
    });
    window.electron.ipcRenderer.on('get-bills', (args: GetBillsOutput) => {
      setBills(args.bills as Bill[]);
    });
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const convertTime = (created: Date) => {
    const iso = created.toISOString().split('T');
    const date = iso[0]
    return (
      <p>
        <span>{`일시: ${date}`}</span>
        <br />
        <span>{`시간: ${created.getHours()}:${created.getMinutes()}:${created.getSeconds()}`}</span>
      </p>
    );
  }

  const convertStore = (storeId: number) => {
    stores.map((item) => {
      if (item.id === storeId) {
        console.log('Store', item)
        return item
      }
    });
  }

  return (
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
      {/* <div>
        <Grid container sm={12}>
          {bills.map((bill) => (
            <Grid item key={bill.id} className={styles.content}>
              {bill.memo}
            </Grid>
          ))}
        </Grid>
      </div> */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="small" aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={'10%'} />
                <TableCell>발행 날짜</TableCell>
                <TableCell>판매처</TableCell>
                <TableCell>구매처</TableCell>
                <TableCell>판매 상품 수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.slice(page * 10, page * 10 + 10).map((bill) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={bill.id}>
                    <TableCell>
                      <Button sx={{ marginBottom: '-20px', fontSize: '13px'}}>자세히 보기</Button>
                    </TableCell>
                    <TableCell>{convertTime(bill.createdAt)}</TableCell>
                    <TableCell>{bill.businessId}</TableCell>
                    <TableCell>{bill.storeId}</TableCell>
                    <TableCell>{console.log(bill.orderProducts)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={bills.length}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </div>
  );
}

export default BillsPage;
