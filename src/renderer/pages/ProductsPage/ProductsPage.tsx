import { useEffect, useRef, useState } from 'react';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import Button from '@mui/material/Button';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, categoriesState, categoryIdState, productsState, tokenState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import styles from './ProductsPage.module.scss';
import { CreateProductInput, CreateProductOutput } from 'main/product/dtos/create-product.dto';
import { DeleteProductOutput } from 'main/product/dtos/delete-product.dto';
import { UpdateProductInput, UpdateProductOutput } from 'main/product/dtos/update-product.dto';
import { Category } from 'main/category/entities/category.entity';
import { GetCategoriesOutput } from 'main/category/dtos/get-categories.dto';
import CategoryModal from './CategoryModal/CategoryModal';
import { SearchProductInput, SearchProductOutput } from 'main/product/dtos/search-product.dto';


const ProductsPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [products, setProducts] = useRecoilState(productsState);
  const [keyword, setKeyword] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [categoryId, setCategoryId] = useRecoilState(categoryIdState);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', {
      token,
      businessId: business.id
    });
    window.electron.ipcRenderer.on(
      'get-products',
      (args: GetProductsOutput) => {
        setProducts(args.products as Product[]);
      }
    );

    window.electron.ipcRenderer.sendMessage('get-categories', {
      token,
      businessId: business.id,
    });
    window.electron.ipcRenderer.on(
      'get-categories',
      (args: GetCategoriesOutput) => {
        setCategories(args.categories as Category[]);
      }
    );
  }, []);


  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }

  const keyHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      console.log(keyword)
      if (keyword != '') {
        const searchData: SearchProductInput = {
          token,
          businessId: business.id,
          keyword: keyword,
          page: page - 1,
        };

        window.electron.ipcRenderer.sendMessage('search-product', searchData);
        window.electron.ipcRenderer.on(
          'search-product',
          ({ ok, error, products }: SearchProductOutput) => {
            if (ok) {
              setProducts(products);
            } else {
              console.log(error);
            }
          }
        );
      } else if (keyword == '') {
        window.electron.ipcRenderer.sendMessage('get-products', {
          token,
          businessId: business.id,
        });
        window.electron.ipcRenderer.on(
          'get-products',
          (args: GetProductsOutput) => {
            setProducts(args.products as Product[]);
          }
        );
      }
    }
  };


  const changeDataHandler = (
    event: React.MouseEvent<unknown>,
    data: Product
  ) => {
    setClicked(true);

    products.forEach((item) => {
      if (item.name === data.name) {
        setId(item.id)
        setName(item.name);
        setPrice(item.price.toString());
        setCategoryId(item.categoryId)
      }
    });
  };

  const deleteDataHandler = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      window.electron.ipcRenderer.sendMessage('delete-product', {
        id: id,
        token,
        businessId: business.id
      });

      window.electron.ipcRenderer.on(
        'delete-product',
        ({ ok, error }: DeleteProductOutput) => {
          if (ok) {
            window.electron.ipcRenderer.sendMessage('get-products', {
              token,
              businessId: business.id,
            });
            window.electron.ipcRenderer.on(
              'get-products',
              (args: GetProductsOutput) => {
                setProducts(args.products as Product[]);
              }
            );
          }
          if (error) {
            window.alert(error);
          }
        }
      )
    }
    clearInputs();
  };

  const updateDataHandler = () => {
    const prices = Number(price)
    const newData: UpdateProductInput = {
      id,
      name,
      price: prices,
      categoryId,
      token,
      businessId: business.id,
    };

      window.electron.ipcRenderer.sendMessage('update-product', newData);

      window.electron.ipcRenderer.on(
        'update-product',
        ({ ok, error }: UpdateProductOutput) => {
          if (ok) {
            window.electron.ipcRenderer.sendMessage('get-products', {
              token,
              businessId: business.id,
            });
            window.electron.ipcRenderer.on(
              'get-products',
              (args: GetProductsOutput) => {
                setProducts(args.products as Product[]);
              }
            );
          }
          if (error) {
            window.alert(error);
          }
        }
      );
  };

  const changeStoreDataHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    dataName: string
  ) => {
    const {value} = event.target;

    if (dataName === 'name') {
      setName(value);
    } else if (dataName === 'price') {
      setPrice(value)
    }
  };

  const clearInputs = () => {
    setClicked(false)

    setName('')
    setPrice('')
    setCategoryId(0);
  };


  const addDataHandler = () => {
    if (name == '' || price == '' || categoryId == 0) {
      if (name == '') window.alert('상품명을 작성해주세요.');
      else if (price == '') window.alert('판매가를 작성해주세요.');
    } else if (!parseInt(price)) {
      window.alert('판매가는 숫자로 작성해주시기 바랍니다.')
    } else {
      const prices = Number(price)
        const newData: CreateProductInput = {
          name,
          price: prices,
          categoryId,
          businessId: business.id,
          token,
        };

        window.electron.ipcRenderer.sendMessage('create-product', newData);

        window.electron.ipcRenderer.on(
          'create-product',
          ({ ok, error }: CreateProductOutput) => {
            if (ok) {
              window.electron.ipcRenderer.sendMessage('get-products', {
                token,
                businessId: business.id,
              });
              window.electron.ipcRenderer.on(
                'get-products',
                ({ ok, error, products }: GetProductsOutput) => {
                  if (ok) {
                    setProducts(products)
                  }
                  if (error) {
                    window.alert(error);
                  }
                }
              );
            }
            if (error) {
              window.alert(error)
            }
          }
        );
        clearInputs();
      }
  };

  const categoryClickHandler = () => {
    setIsOpen(true);
  }

  const LAST_PAGE =
    products.length % 9 === 0
      ? Math.round(products.length / 9)
      : Math.floor(products.length / 9) + 1;

  const handlePage = (event: any) => {
    setPage(parseInt(event.target.outerText));
  };

  return (
    <>
      <CategoryModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <input
              type="search"
              value={keyword}
              onChange={filter}
              placeholder="상품 검색"
              className={styles.searchInput}
              onKeyDown={keyHandler}
            />
            <div className={styles.userList}>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products &&
                        products.length > 0 &&
                        products
                          .slice((page - 1) * 9, page * 9)
                          .map((item) => (
                            <TableRow
                              key={item.name}
                              className={styles.dataRow}
                              onClick={(event) =>
                                changeDataHandler(event, item)
                              }
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
                                {categories.map((cat) => {
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
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <div className={styles.pagination}>
              <Pagination
                count={LAST_PAGE}
                size="small"
                color="standard"
                defaultPage={1}
                boundaryCount={1}
                onChange={(event) => handlePage(event)}
              />
            </div>
          </div>
          <div>
            <div className={styles.infoContent}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginTop: '20px',
                }}
              >
                상품 정보
              </Typography>
              <button className={styles.clearInput} onClick={clearInputs}>
                비우기
              </button>
              <div className={styles.list}>
                <div>
                  <div>
                    <div className={styles.item}>
                      <p className={styles.labels}>상품명</p>
                      <input
                        value={name}
                        className={styles.dataInput}
                        onChange={(event) =>
                          changeStoreDataHandler(event, 'name')
                        }
                      />
                    </div>
                    <div className={styles.item}>
                      <p className={styles.labels}>판매가</p>
                      <input
                        value={price}
                        className={styles.dataInput}
                        onChange={(event) =>
                          changeStoreDataHandler(event, 'price')
                        }
                      />
                    </div>
                    <div className={styles.lastItem}>
                      <p className={styles.labels}>카테고리</p>
                      {categoryId ? (
                        <input
                          value={categoryId}
                          className={styles.dataInput}
                          style={{ backgroundColor: 'white', color: 'black' }}
                          onChange={(event) =>
                            changeStoreDataHandler(event, 'categoryId')
                          }
                          disabled
                        />
                      ) : (
                        <button
                          className={styles.buttons}
                          onClick={categoryClickHandler}
                        >
                          카테고리 보기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.buttonList}>
                  {clicked ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ marginLeft: '40px' }}
                      color="error"
                      onClick={deleteDataHandler}
                    >
                      삭제
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  {!clicked ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ marginRight: '10px' }}
                      onClick={addDataHandler}
                    >
                      생성
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ marginRight: '10px', backgroundColor: 'coral' }}
                      onClick={updateDataHandler}
                    >
                      수정
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
