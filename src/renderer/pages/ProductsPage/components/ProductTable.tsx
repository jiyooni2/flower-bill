import { StarOutlineRounded, StarRateRounded } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Product } from "main/product/entities/product.entity";
import styles from '../ProductsPage.module.scss';
import useAddComma from "renderer/hooks/useAddComma";
import { TableProps } from "../ProductsPage.interface";

const ProductTable = ({
  products,
  categories,
  inputs,
  setInputs,
  setId,
  setClicked,
}: TableProps) => {
  const addComma = useAddComma();

  const changeDataHandler = (
    event: React.MouseEvent<unknown>,
    data: Product
  ) => {
    if (products != undefined) {
      products.forEach((item) => {
        if (item?.name === data.name) {
          setInputs({
            ...inputs,
            id: item.id,
            name: item?.name,
            price: item.price.toString(),
            favorite: item.isFavorite,
            categoryName: item.category?.name,
            clicked: true,
          });
          setId(item.categoryId);
          setClicked(true);
        }
      });
    }
  };

  return (
    <>
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
                <TableCell component="th" align="left">
                  상품명
                </TableCell>
                <TableCell component="th" align="left">
                  판매가
                </TableCell>
                <TableCell component="th" align="left">
                  카테고리
                </TableCell>
                <TableCell component="th"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products != undefined &&
                products
                  .slice((inputs.page - 1) * 9, inputs.page * 9)
                  ?.map((item) => (
                    <TableRow
                      key={item?.name}
                      className={styles.dataRow}
                      onClick={(event) => changeDataHandler(event, item)}
                      sx={{
                        '& th': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      <TableCell
                        className={styles.cutText}
                        component="th"
                        align="left"
                        sx={{ width: '50%' }}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        sx={{ width: '28%' }}
                      >
                        {addComma(`${item.price}`)}
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        className={styles.cutText}
                        sx={{ width: '35%' }}
                      >
                        {categories != undefined &&
                          categories?.map((cat) => {
                            if (cat.id === item.categoryId) {
                              if (cat.parentCategory.parentCategory) {
                                return `${cat.parentCategory.parentCategory?.name} / ${cat.parentCategory?.name} / ${cat?.name}`;
                              } else if (cat.parentCategory) {
                                return `${cat.parentCategory?.name}/${cat?.name}`;
                              } else {
                                return cat?.name;
                              }
                            }
                          })}
                      </TableCell>
                      <TableCell>
                        {item.isFavorite ? (
                          <StarRateRounded
                            className={styles.favorite}
                            sx={{ color: 'gold' }}
                          />
                        ) : (
                          <StarOutlineRounded
                            className={styles.favorite}
                            color="action"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {products && products.length == 0 && (
        <div className={styles.noResult}>
          <div>
            <h3>검색결과가 없습니다.</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
