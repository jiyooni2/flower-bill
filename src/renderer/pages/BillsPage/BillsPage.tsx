import { GetBillsOutput } from "main/bill/dtos/get-bills.dto";
import { Bill } from "main/bill/entities/bill.entity";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { billListState, billState, businessState, businessesState, detailBillState, orderProductsState, storesState, tokenState } from "renderer/recoil/states";
import styles from './BillsPage.module.scss'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { GetBillOutput } from "main/bill/dtos/get-bill.dto";
import { Link } from "react-router-dom";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ReactToPrint from "react-to-print";
import { BillResult } from "main/common/dtos/bill-result.dto";
import BillModal from "./UpdateBillPage/components/BillModal/BillModal";
import { alertState } from "renderer/recoil/bill-states";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Delete } from "@mui/icons-material";
import { DeleteBillOutput } from "main/bill/dtos/delete-bill.dto";

const BillsPage = () => {
  const token = useRecoilValue(tokenState)
  const business = useRecoilValue(businessState)
  const [bills, setBills] = useRecoilState(billListState)
  const [bill, setBill] = useRecoilState(billState)
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState)
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

  const detailHandler = (id: number) => {
    console.log('DetailHandler' , id)
    window.electron.ipcRenderer.sendMessage('get-bill', {
      token,
      id,
      businessId: business.id
    });

    window.electron.ipcRenderer.on(
      'get-bill',
      ({ ok, error, bill }: GetBillOutput) => {
        if (ok) {
          // setDetailBill(bill);
          setOrderProducts(bill.orderProducts)
          setBill(bill)
        } else {
          console.log(error)
        }
      }
    );
  };

  const deleteHandler = (id: number) => {
    window.electron.ipcRenderer.sendMessage('delete-bill', {
      token,
      id,
      businessId: business.id,
    });

    window.electron.ipcRenderer.on(
      'delete-bill',
      ({ ok, error }: DeleteBillOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-bills', {
            token,
            businessId: business.id,
            page: page,
          });
          window.electron.ipcRenderer.on(
            'get-bills',
            (args: GetBillsOutput) => {
               setBills(args.bills as Bill[]);
            }
          );
        } else {
          console.log(error);
        }
      }
    );
  };



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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
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
              <TableBody>
                {bills != undefined &&
                  bills.slice(page * 10, page * 10 + 10).map((bill) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={bill.id}
                      >
                        <TableCell>
                          <Link
                            to={'/detail-bills'}
                            style={{
                              marginBottom: '-20px',
                              fontSize: '13px',
                              color: '#0971f1',
                              fontWeight: '500',
                            }}
                            onClick={() => detailHandler(bill.id)}
                          >
                            자세히 보기
                          </Link>
                        </TableCell>
                        <TableCell>{convertTime(bill.createdAt)}</TableCell>
                        <TableCell>{convertTime(bill.updatedAt)}</TableCell>
                        <TableCell>{bill.business.name}</TableCell>
                        <TableCell>{bill.store ? bill.store.name : `(undefined)`}</TableCell>
                        <TableCell>
                          <Delete
                            sx={{
                              fontSizee: '16px',
                              cursor: 'pointer',
                              marginBottom: '-10px',
                              color: 'crimson',
                            }}
                            onClick={() => deleteHandler(bill.id)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={bills != undefined && bills.length}
            rowsPerPage={10}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </div>
    </>
  );
}

export default BillsPage;
