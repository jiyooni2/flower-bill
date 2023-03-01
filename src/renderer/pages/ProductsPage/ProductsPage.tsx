import { useEffect, useState } from 'react';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, productsState, tokenState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import CreateProductModal from './components/CreateProductModal/CreateProductModal';
import styles from './ProductsPage.module.scss';
import { CreateProductInput, CreateProductOutput } from 'main/product/dtos/create-product.dto';
import { DeleteProductOutput } from 'main/product/dtos/delete-product.dto';
import { UpdateProductInput, UpdateProductOutput } from 'main/product/dtos/update-product.dto';


const ProductsPage = () => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [products, setProducts] = useRecoilState(productsState);
  const [keyword, setKeyword] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [clickedProduct, setClickedProduct] = useState({
    name: '',
    price: 0,
    categoryId: 0,
  });

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
  }, []);


  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const word = e.target.value;

    if (keyword !== '') {
      const results = products.filter((product) => {
        return product.name.startsWith(word);
      });
      setProducts(results);
    } else {
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

    setKeyword(word);
  };

  const changeDataHandler = (
    event: React.MouseEvent<unknown>,
    data: Product
  ) => {
    setClicked(true);

    products.forEach((item) => {
      if (item.name === data.name) {
        setName(item.name);
        setPrice(item.price);
        setCategoryId(item.categoryId);
        setClickedProduct({
          name: item.name,
          price: item.price,
          categoryId: item.categoryId,
        });
      }
    });
  };

  const deleteDataHandler = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
    window.electron.ipcRenderer.sendMessage('delete-product', {
      token,
      businessId: business.id
    });

    window.electron.ipcRenderer.on(
      'delete-product',
      ({ ok, error }: DeleteProduct) => {
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
    )}
  };

  const updateDataHandler = () => {
    const newData: UpdateProductInput = {
      id: products.length + 1,
      name,
      price,
      categoryId,
      token,
      businessId: business.id
    };

      window.electron.ipcRenderer.sendMessage('update-product', {
        ...newData,
      });

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
      setPrice(parseInt(value));
    } else if (dataName === 'categoryId') {
      setCategoryId(parseInt(value));
    }
  };

  const clearInputs = () => {
    setClicked(false)

    setName('')
    setPrice(0)
    setCategoryId(0)
    setClickedProduct(
      {
        name: '',
        price: 0,
        categoryId: 0,
      },
    );
  };


  const addDataHandler = () => {
    if (name != '' && price != 0 && categoryId != 0) {
        const newData: CreateProductInput = {
          name,
          price,
          categoryId,
          businessId: business.id,
          token
        };

        window.electron.ipcRenderer.sendMessage('create-product', {
          ...newData,
        });

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
                (args: GetProductsOutput) => {
                  setProducts(args.products as Product[]);
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


  return (
    <>
      <CreateProductModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <input
              type="search"
              value={keyword}
              onChange={filter}
              placeholder="판매처 검색"
              className={styles.searchInput}
            />
            <Button
              sx={{ color: 'black', marginLeft: '-3rem', paddingTop: '25px' }}
            >
              검색
            </Button>
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
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '10%' }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '30%' }}
                        >
                          상품명
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '30%' }}
                        >
                          판매가
                        </TableCell>
                        <TableCell
                          component="th"
                          align="left"
                          sx={{ width: '35%' }}
                        >
                          분류번호
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products &&
                        products.length > 0 &&
                        products.map((item) => (
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
                              sx={{ width: '30%' }}
                            >
                              {item.name}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                              sx={{ width: '30%' }}
                            >
                              ₩ {item.price}
                            </TableCell>
                            <TableCell
                              component="th"
                              align="left"
                              className={styles.cutText}
                              sx={{ width: '35%' }}
                            >
                              {item.categoryId}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {products && products.length == 0 && (
                  <div className={styles.noResult}>
                    <div>
                      <h3>검색결과가 없습니다.</h3>
                    </div>
                  </div>
                )}
              </div>
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
                판매자 정보
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
                    <div className={styles.item}>
                      <p className={styles.labels}>카테고리 번호</p>
                      <input
                        value={categoryId}
                        className={styles.dataInput}
                        onChange={(event) =>
                          changeStoreDataHandler(event, 'categoryId')
                        }
                      />
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
