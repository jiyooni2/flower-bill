import { Table, TableContainer,TableHead,TableRow,TableCell,TableBody } from "@mui/material";
import { OrderProduct } from "main/orderProduct/entities/orderProduct.entity";
import { useRecoilValue } from "recoil";
import { categoriesState } from "renderer/recoil/states";


type IProps = {
  orderProducts: OrderProduct[];
}

const DetailTable = ({ orderProducts }: IProps) => {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'auto',
      }}
    >
      <div style={{ width: '100%', height: '100%'}}>
        <TableContainer sx={{ width: '100%', height: '100%', marginLeft: '2%' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: 'lightgray', opacity: '0.6' }}
              >
                <TableCell width={'20%'} sx={{ fontSize: '13px' }}>
                  상품명
                </TableCell>
                <TableCell width={'20%'} sx={{ fontSize: '13px' }}>
                  판매가
                </TableCell>
                <TableCell width={'20%'} sx={{ fontSize: '13px' }}>
                  카테고리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderProducts != undefined &&
                orderProducts?.map((item) => (
                  <TableRow
                    key={`${item.id}${item.productId}`}
                    sx={{
                      '& th': { fontSize: '13px' },
                    }}
                  >
                    <TableCell component="th">
                      {item.product?.name}
                    </TableCell>
                    <TableCell>{item.orderPrice} 원</TableCell>
                    <TableCell>{item.product.categoryId}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
};

export default DetailTable;
