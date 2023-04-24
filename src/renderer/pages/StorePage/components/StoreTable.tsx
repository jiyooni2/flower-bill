import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Store } from "main/store/entities/store.entity";
import React from "react";
import styles from '../StorePage.module.scss'
import { Inputs } from "../types";


type IProps = {
  stores: Store[];
  inputs: Inputs;
  setInputs : React.Dispatch<React.SetStateAction<Inputs>>;
  setClickedStore: React.Dispatch<React.SetStateAction<Store>>;
}

const StoreTable = ({ stores, inputs, setInputs, setClickedStore } : IProps) => {

  const changeDataHandler = (event: React.MouseEvent<unknown>, data: Store) => {
    stores?.forEach((item) => {
      if (item.name === data.name) {
        setInputs({...inputs, storeNumber: item.businessNumber.toString(), storeName: item.name, owner: item.owner, address: item.address, clicked: true});
        setClickedStore({
          id: data.id,
          business: item.business,
          businessId: item.businessId,
          businessNumber: item.businessNumber,
          name: item.name,
          owner: item.owner,
          address: item.address,
        });
      }
    });
  };

  return (
    <div>
                <TableContainer sx={{ width: '100%' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          borderBottom: '1.5px solid black',
                          backgroundColor: 'lightgray',
                          '& th': {
                            fontSize: '14px',
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '27%' }}
                        >
                          사업자번호
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '27%' }}
                        >
                          상호
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '25%' }}
                        >
                          사업자명
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '35%' }}
                        >
                          소재지
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stores != undefined &&
                        stores.length > 0 &&
                        stores?.map((store) => (
                          <TableRow
                            key={store.businessNumber}
                            className={styles.dataRow}
                            onClick={(event) => changeDataHandler(event, store)}
                            sx={{
                              '& th': {
                                fontSize: '14px',
                              },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                            >
                              {store.businessNumber}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                            >
                              {store.name}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                            >
                              {store.owner}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                              className={styles.cutText}
                            >
                              {store.address}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {stores && stores.length == 0 && (
                  <div className={styles.noResult}>
                    <div>
                      <h3>검색결과가 없습니다.</h3>
                    </div>
                  </div>
                )}
              </div>
  )
};

export default StoreTable;
