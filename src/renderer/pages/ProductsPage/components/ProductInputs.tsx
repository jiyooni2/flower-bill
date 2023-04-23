import { StarOutlineRounded, StarRateRounded } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { CreateProductInput, CreateProductOutput } from 'main/product/dtos/create-product.dto';
import { DeleteProductOutput } from 'main/product/dtos/delete-product.dto';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { UpdateProductInput, UpdateProductOutput } from 'main/product/dtos/update-product.dto';
import { Product } from 'main/product/entities/product.entity';
import { useState } from 'react';
import { SetterOrUpdater, useRecoilValue } from 'recoil';
import { businessState, tokenState } from 'renderer/recoil/states';
import styles from '.././ProductsPage.module.scss';
import { Error, Input } from '../types';
import { createValidation, switched } from '../validation';
import CategoryModal from './CategoryModal/CategoryModal';


type IProps = {
  inputs: Input;
  errors: Error;
  setInputs: React.Dispatch<Input>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setErrors: React.Dispatch<React.SetStateAction<Error>>;
  setCategoryId: SetterOrUpdater<number>;
  id: number;
}

const ProductInputs = ( { inputs, setInputs, errors, setErrors, id, setProducts, setCategoryId } : IProps ) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);
  const [isOpen, setIsOpen] = useState<boolean>(false);


  const clearInputs = () => {
    setInputs({...inputs, clicked: false, name: '', price: ''})
    setCategoryId(0);
    setErrors({ name: '', price: '', category: '' });
  };

  const changeStoreDataHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const validation = switched(name, value)
    if (validation.success) {
      setErrors({ ...errors, [name]: '' });
      setInputs({...inputs, [name]: value})
    } else {
      setErrors({ ...errors, [name]: validation.error})
    }
  };

  const starHandler = () => {
    setInputs({...inputs, favorite: !inputs.favorite})

     const newData: UpdateProductInput = {
       id: inputs.id,
       name: inputs.name,
       price: Number(inputs.price),
       categoryId: id,
       token,
       businessId: business.id,
       isFavorite: !inputs.favorite,
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
          console.error(error);
        }
      }
    );
  }

  const deleteDataHandler = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      window.electron.ipcRenderer.sendMessage('delete-product', {
        id: inputs.id,
        token,
        businessId: business.id,
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
            console.error(error);
          }
        }
      );
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
          console.error(error);
        }
      }
    );
    setInputs({...inputs, favorite: false})
  };

  const addDataHandler = () => {
    if (id == 0) {
      setErrors({ ...errors, category: '카테고리가 선택되지 않았습니다.' });
      return;
    }

    const validation = createValidation(inputs)
    if (!validation.success) {
      setErrors({...errors, [validation.name]: validation.error})
    } else {
      const newData: CreateProductInput = {
        name: inputs.name,
        price: Number(inputs.price),
        categoryId: id,
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
              page: inputs.page - 1,
              businessId: business.id,
            });
            window.electron.ipcRenderer.on(
              'get-products',
              ({ ok, error, products }: GetProductsOutput) => {
                if (ok) {
                  setProducts(products);
                }
                if (error) {
                  console.error(error);
                }
              }
            );
          }
          if (error) {
            console.log(error);
          }
        }
      );
    }
    clearInputs();
  };

  const categoryClickHandler = () => {
    setIsOpen(true);
  };

  return (
    <>
      <CategoryModal isOpen={isOpen} setIsOpen={setIsOpen} />
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
                <div style={{ width: '50%', height: '33px'}}>
                  {inputs.clicked ? inputs.favorite ? (
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
                  errors.name.length > 0
                    ? styles.itemWithError
                    : styles.item
                }
              >
                <p className={styles.labels}>상품명</p>
                <input
                  className={
                    errors.name.length > 0
                      ? styles.hasError
                      : styles.dataInput
                  }
                  value={inputs.name}
                  name="name"
                  onChange={changeStoreDataHandler}
                  maxLength={20}
                />
              </div>
              {errors.name && (
                <span className={styles.errorMessage}>{errors.name}</span>
              )}
              <div
                className={
                  errors.price.length > 0
                    ? styles.itemWithError
                    : styles.item
                }
              >
                <p className={styles.labels}>판매가</p>
                <input
                  className={
                    errors.price.length > 0
                      ? styles.hasError
                      : styles.dataInput
                    }
                  value={inputs.price}
                  name="price"
                  onChange={changeStoreDataHandler}
                />
              </div>
              {errors.price && (
                <span className={styles.errorMessage}>
                  {errors.price}
                </span>
              )}
              <div className={styles.lastItem}>
                <p className={styles.categoryLabel}>카테고리</p>
                {id ? (
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
                        errors.category.length > 0
                          ? styles.categoryError
                          : styles.buttons
                      }
                      style={{ float: 'right' }}
                      onClick={categoryClickHandler}
                    >
                      카테고리 선택하기
                    </button>
                  </>
                )}
              </div>
                {errors.category ? (
                  <span className={styles.errorMessage}>
                    {errors.category}
                  </span>
                ) : (
                  <span className={styles.infoMessage}>
                    카테고리는 소분류만 선택 가능합니다.
                    </span>
                )}
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
                disabled={errors.name.length > 0}
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
  )
};

export default ProductInputs;
