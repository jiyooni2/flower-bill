import { GetBillsOutput } from "main/bill/dtos/get-bills.dto";
import { Bill } from "main/bill/entities/bill.entity";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { billListState, billState, businessState, orderProductsState, tokenState } from "renderer/recoil/states";
import styles from './BillsPage.module.scss'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { GetBillOutput } from "main/bill/dtos/get-bill.dto";
import { Link } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import { DeleteBillOutput } from "main/bill/dtos/delete-bill.dto";
import { toast } from "react-toastify";

const BillsPage = () => {
  const token = useRecoilValue(tokenState)
  const business = useRecoilValue(businessState)
  const [bills, setBills] = useRecoilState(billListState)
  const [bill, setBill] = useRecoilState(billState)
  const [orderProducts, setOrderProducts] = useRecoilState(orderProductsState)
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
        <span>{`시간: ${created.getHours()}:${created.getMinutes() < 10 ? `0${created.getMinutes()}` : created.getMinutes()}:${created.getSeconds() < 10 ? `0${created.getSeconds()}` : created.getSeconds()}`}</span>
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
          setAlert({ success: '계산서가 삭제되었습니다.', error: '' });
        } else {
          if (error.startsWith('존재')) {
            setAlert({ success: '', error: error})
          } else {
            setAlert({ success: '', error: `네트워크 ${error}`})
          }
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
                        <TableCell>{bill.business?.name}</TableCell>
                        <TableCell>
                          {bill.store ? bill.store.name : `(undefined)`}
                        </TableCell>
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
            rowsPerPage={8}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      </div>
    </>
  );
}

export default BillsPage;
