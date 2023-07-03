import { StarOutlineRounded, StarRateRounded } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import {
  CreateProductInput,
  CreateProductOutput,
} from 'main/product/dtos/create-product.dto';
import { DeleteProductOutput } from 'main/product/dtos/delete-product.dto';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import {
  UpdateProductInput,
  UpdateProductOutput,
} from 'main/product/dtos/update-product.dto';
import { Product } from 'main/product/entities/product.entity';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useAddComma from 'renderer/hooks/useAddComma';
import { businessState, tokenState } from 'renderer/recoil/states';
import styles from '.././ProductsPage.module.scss';
import CategoryModal from './CategoryModal/CategoryModal';
import { toast } from 'react-toastify';
import { FormProps } from '../ProductsPage.interface';

const ProductInputs = ({
  inputs,
  setInputs,
  id,
  setProducts,
  setCategoryId,
  clicked,
}: FormProps) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState({ success: '', error: '' });
  const addComma = useAddComma();

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
    const createProductRemover = window.electron.ipcRenderer.on(
      'create-product',
      ({ ok, error }: CreateProductOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-products', {
            token,
            page: inputs.page - 1,
            businessId: business.id,
          });
          setAlert({ success: '상품이 생성되었습니다.', error: '' });
          clearInputs();
        } else {
          if (error.startsWith('최하위') || error.startsWith('없는')) {
            setAlert({ success: '', error: error });
          } else {
            setAlert({ success: '', error: `네트워크 ${error}` });
          }
        }
      }
    );

    const getProductsRemover = window.electron.ipcRenderer.on(
      'get-products',
      (args: GetProductsOutput) => {
        setProducts(args.products as Product[]);
      }
    );

    const deleteProductRemover = window.electron.ipcRenderer.on(
      'delete-product',
      ({ ok, error }: DeleteProductOutput) => {
        if (ok) {
          setAlert({ error: '', success: '상품이 삭제되었습니다.' });
          window.electron.ipcRenderer.sendMessage('get-products', {
            token,
            businessId: business.id,
          });
          clearInputs();
        }
        if (error) {
          console.error(error);
          if (error.startsWith('존재') || error.startsWith('해당 상품')) {
            setAlert({ success: '', error: error });
          } else {
            setAlert({ success: '', error: `네트워크 ${error}` });
          }
        }
      }
    );

    const updateProductRemover = window.electron.ipcRenderer.on(
      'update-product',
      ({ ok, error }: UpdateProductOutput) => {
        if (ok) {
          setAlert({ success: '상품이 수정되었습니다.', error: '' });
          window.electron.ipcRenderer.sendMessage('get-products', {
            token,
            businessId: business.id,
          });
          clearInputs();
        }
        if (error) {
          console.error(error);
          if (error.startsWith('존재') || error.startsWith('해당 상품')) {
            setAlert({ success: '', error: error });
          } else {
            setAlert({ success: '', error: `네트워크 ${error}` });
          }
        }
      }
    );

    return () => {
      createProductRemover();
      updateProductRemover();
      deleteProductRemover();
      getProductsRemover();
    };
  });

  const clearInputs = () => {
    setInputs({ ...inputs, name: '', price: '', clicked: false });
    setCategoryId(0);
  };

  const changeStoreDataHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const starHandler = () => {
    setInputs({ ...inputs, favorite: !inputs.favorite });
  };

  const deleteDataHandler = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      window.electron.ipcRenderer.sendMessage('delete-product', {
        id: inputs.id,
        token,
        businessId: business.id,
      });
    }
  };

  const updateDataHandler = () => {
    const newData: UpdateProductInput = {
      id: inputs.id,
      name: inputs.name,
      price: Number(inputs.price),
      categoryId: id,
      token,
      businessId: business.id,
      isFavorite: inputs.favorite,
    };

    window.electron.ipcRenderer.sendMessage('update-product', newData);

    setInputs({ ...inputs, favorite: false });
  };

  const addDataHandler = () => {
    if (id == 0) {
      setAlert({ success: '', error: '카테고리가 선택되지 않았습니다.' });
      return;
    }

    const newData: CreateProductInput = {
      name: inputs.name,
      price: Number(inputs.price.replace(',', '')),
      categoryId: id,
      businessId: business.id,
      token,
    };
    window.electron.ipcRenderer.sendMessage('create-product', newData);
  };

  const categoryClickHandler = () => {
    setIsOpen(true);
  };

  return (
    <>
      <CategoryModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setCategoryId={setCategoryId}
      />
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
        <div>
          <button className={styles.clearInput} onClick={clearInputs}>
            비우기
          </button>
        </div>
        <div className={styles.list}>
          <div>
            <div>
              <div className={styles.item}>
                <p className={styles.labels}>즐겨찾기</p>
                <div style={{ width: '50%', height: '33px' }}>
                  {inputs.name !== '' || inputs.price !== '' ? (
                    inputs.favorite ? (
                      <StarRateRounded
                        className={styles.favorite}
                        sx={{ color: 'gold', cursor: 'pointer' }}
                        onClick={() => starHandler()}
                      />
                    ) : (
                      <StarOutlineRounded
                        className={styles.favorite}
                        sx={{ cursor: 'pointer' }}
                        color="action"
                        onClick={() => starHandler()}
                      />
                    )
                  ) : (
                    <StarOutlineRounded
                      className={styles.favorite}
                      color="action"
                    />
                  )}
                </div>
              </div>
              <div
                className={
                  // errors.name.length > 0 ? styles.itemWithError : styles.item
                  styles.item
                }
              >
                <p className={styles.labels}>상품명</p>
                <input
                  className={
                    // errors.name.length > 0 ? styles.hasError : styles.dataInput
                    styles.dataInput
                  }
                  value={inputs.name}
                  name="name"
                  onChange={changeStoreDataHandler}
                  maxLength={20}
                />
              </div>
              {/* {errors.name && (
                <span className={styles.errorMessage}>{errors.name}</span>
              )} */}
              <div
                className={
                  // errors.price.length > 0 ? styles.itemWithError : styles.item
                  styles.item
                }
              >
                <p className={styles.labels}>판매가</p>
                <input
                  className={
                    // errors.price.length > 0 ? styles.hasError : styles.dataInput
                    styles.dataInput
                  }
                  value={addComma(inputs.price)}
                  name="price"
                  onChange={changeStoreDataHandler}
                />
              </div>
              {/* {errors.price && (
                <span className={styles.errorMessage}>{errors.price}</span>
              )} */}
              <div className={styles.lastItem}>
                <p className={styles.categoryLabel}>카테고리</p>
                {!clicked && id ? (
                  <input
                    name="category"
                    value={inputs.categoryName}
                    className={styles.dataInput}
                    style={{ backgroundColor: 'white', color: 'black' }}
                    onChange={changeStoreDataHandler}
                    disabled
                  />
                ) : (
                  <>
                    <button
                      className={
                        // errors.category.length > 0
                        //   ? styles.categoryError
                        //   : styles.buttons
                        styles.buttons
                      }
                      style={{ float: 'right' }}
                      onClick={categoryClickHandler}
                    >
                      {id ? '카테고리 수정하기' : '카테고리 선택하기'}
                    </button>
                  </>
                )}
              </div>
              {/* {errors.category ? (
                <span className={styles.errorMessage}>{errors.category}</span>
              ) : (
                <span className={styles.infoMessage}>
                  카테고리는 소분류만 선택 가능합니다.
                </span>
              )} */}
            </div>
          </div>
          <div className={styles.buttonList}>
            {inputs.clicked ? (
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
            {!inputs.clicked ? (
              <Button
                variant="contained"
                size="small"
                sx={{ marginRight: '10px' }}
                onClick={addDataHandler}
                // disabled={errors.name.length > 0}
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
    </>
  );
};

export default ProductInputs;
