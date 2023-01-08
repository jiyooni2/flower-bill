import { TextField } from '@mui/material';
import { useSetRecoilState } from 'recoil';
import Button from '@mui/material/Button';
import useInputs from 'renderer/hooks/useInputs';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import { productsState } from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import Modal from 'renderer/components/Modal/Modal';
import styles from './CreateProductModal.module.scss';

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

    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
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
    </Modal>
  );
};

export default CreateProductModal;
