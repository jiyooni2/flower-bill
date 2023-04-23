import { StarOutlineRounded, StarRateRounded } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Category } from "main/category/entities/category.entity";
import { Product } from "main/product/entities/product.entity";
import { SetterOrUpdater } from "recoil";
import styles from '../ProductsPage.module.scss';
import { Input } from "../types";


type IProps = {
  products: Product[];
  categories: Category[];
  inputs: Input;
  setInputs: React.Dispatch<React.SetStateAction<Input>>;
  setId: SetterOrUpdater<number>;
}

const ProductTable = ({ products, categories, inputs, setInputs, setId }: IProps) => {

  const changeDataHandler = (
    event: React.MouseEvent<unknown>,
    data: Product
  ) => {
    setInputs({...inputs, clicked: true})

    if (products != undefined) {
      products.forEach((item) => {
        if (item.name === data.name) {
          setInputs({...inputs, id: item.id, name: item.name, price: item.price.toString(), favorite: item.isFavorite, categoryName: item.category?.name})
          setId(item.categoryId);
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
                  ID
                </TableCell>
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
                products.slice((inputs.page - 1) * 9, inputs.page * 9).map((item) => (
                  <TableRow
                    key={item.name}
                    className={styles.dataRow}
                    onClick={(event) => changeDataHandler(event, item)}
                    sx={{
                      '& th': {
                        fontSize: '14px',
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      align="left"
                      sx={{ width: '10%' }}
                    >
                      {item.id}
                    </TableCell>
                    <TableCell
                      component="th"
                      align="left"
                      sx={{ width: '25%' }}
                    >
                        {item.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      align="left"
                      sx={{ width: '28%' }}
                    >
                      {item.price}
                    </TableCell>
                    <TableCell
                      component="th"
                      align="left"
                      className={styles.cutText}
                      sx={{ width: '45%' }}
                    >
                      {categories != undefined &&
                        categories.map((cat) => {
                          if (cat.id === item.categoryId) {
                            if (cat.parentCategory.parentCategory) {
                              return `${cat.parentCategory.parentCategory.name} / ${cat.parentCategory.name} / ${cat.name}`;
                            } else if (cat.parentCategory) {
                              return `${cat.parentCategory.name}/${cat.name}`;
                            } else {
                              return cat.name;
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
  )
};

export default ProductTable;
