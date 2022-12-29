import { Modal, TextField } from '@mui/material';
import styles from './CreateProductModal.module.scss';
import useInputs from './../../../../hooks/useInputs';
import Button from '@mui/material/Button';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { useSetRecoilState } from 'recoil';
import { productsState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IForm {
  name: string;
  price: string;
  categoryId: string;
}

const CreateProductModal = ({ isOpen, setIsOpen }: IProps) => {
  const setProducts = useSetRecoilState(productsState);
  const [{ name, price, categoryId }, handleChange] = useInputs<IForm>({
    name: '',
    price: '',
    categoryId: '',
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(name, price, categoryId);
    const product = {
      name,
      price: Number(price),
      categoryId: Number(categoryId),
    };

    window.electron.ipcRenderer.sendMessage('create-product', product);

    window.electron.ipcRenderer.on(
      'create-product',
      ({ ok, error }: GetProductsOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-products', {});
          window.electron.ipcRenderer.on(
            'get-products',
            (args: GetProductsOutput) => {
              setProducts(args.products as Product[]);
            }
          );
        }
        if (error) {
          console.log(error);
        }
      }
    );

    handleClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className={styles.modal_container}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="상품명"
            name="name"
            variant="filled"
            onChange={handleChange}
            value={name}
          />
          <TextField
            label="가격"
            name="price"
            variant="filled"
            onChange={handleChange}
            value={price}
          />
          <TextField
            label="카테고리 번호"
            name="categoryId"
            variant="filled"
            onChange={handleChange}
            value={categoryId}
          />
          <Button type="submit">제출</Button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateProductModal;
