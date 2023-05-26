import { Delete } from '@mui/icons-material';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { DeleteBillOutput } from 'main/bill/dtos/delete-bill.dto';
import { GetBillOutput } from 'main/bill/dtos/get-bill.dto';
import { GetBillsOutput } from 'main/bill/dtos/get-bills.dto';
import { Bill } from 'main/bill/entities/bill.entity';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  billListState,
  billState,
  businessState,
  orderProductsState,
  tokenState,
} from 'renderer/recoil/states';
import { BodyProps } from './UpdatePage.interface';

const Body = ({ setAlert, page, date }: BodyProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [bills, setBills] = useRecoilState(billListState);
  const setBill = useSetRecoilState(billState);
  const setOrderProducts = useSetRecoilState(orderProductsState);

  const convertTime = (created: Date) => {
    const iso = created.toISOString().split('T');
    const date = iso[0];
    return (
      <p>
        <span>{`일시: ${date}`}</span>
        <br />
        <span>{`시간: ${created.getHours()}:${
          created.getMinutes() < 10
            ? `0${created.getMinutes()}`
            : created.getMinutes()
        }:${
          created.getSeconds() < 10
            ? `0${created.getSeconds()}`
            : created.getSeconds()
        }`}</span>
      </p>
    );
  };

  const detailHandler = (id: number) => {
    console.log('DetailHandler', id);
    window.electron.ipcRenderer.sendMessage('get-bill', {
      token,
      id,
      businessId: business.id,
    });

    window.electron.ipcRenderer.on(
      'get-bill',
      ({ ok, error, bill }: GetBillOutput) => {
        if (ok) {
          setOrderProducts(bill.orderProducts);
          setBill(bill);
        } else {
          console.log(error);
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
            setAlert({ success: '', error: error });
          } else {
            setAlert({ success: '', error: `네트워크 ${error}` });
          }
        }
      }
    );
  };

  // bills.map((el) => {

  // });

  return (
    <TableBody>
      {bills != undefined &&
        bills
          .filter((el) =>
            date !== null
              ? new Date(el.createdAt)?.getFullYear() === date?.getFullYear() &&
                new Date(el.createdAt)?.getMonth() === date?.getMonth() &&
                new Date(el.createdAt)?.getDate() === date?.getDate()
              : el === el
          )
          .slice((page - 1) * 8, page * 8)
          .map((bill) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={bill.id}>
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
  );
};

export default Body;
