import { ipcMain } from 'electron';
import { GetProductsInput } from './dtos/get-products.dto';
import { productService } from '../main';
import { CreateProductInput } from './dtos/create-product.dto';
import { UpdateProductInput } from './dtos/update-product.dto';
import { DeleteProductInput } from './dtos/delete-product.dto';
import { SearchProductInput } from './dtos/search-product.dto';
import { GetProductByCategoryInput } from './dtos/get-product-by-category.dto';

ipcMain.on(
  'get-products',
  async (event, getProductsInput: GetProductsInput) => {
    const products = await productService.getProducts(getProductsInput);
    event.reply('get-products', products);
  }
);

ipcMain.on(
  'create-product',
  async (event, createProductInput: CreateProductInput) => {
    const result = await productService.createProduct(createProductInput);
    event.reply('create-product', result);
  }
);

ipcMain.on(
  'update-product',
  async (event, updateProductInput: UpdateProductInput) => {
    const result = await productService.updateProduct(updateProductInput);
    event.reply('update-product', result);
  }
);

ipcMain.on(
  'delete-product',
  async (event, deleteProductInput: DeleteProductInput) => {
    const result = await productService.deleteProduct(deleteProductInput);

    event.reply('delete-product', result);
  }
);

ipcMain.on(
  'search-product',
  async (event, searchProductInput: SearchProductInput) => {
    const result = await productService.searchProduct(searchProductInput);
    event.reply('search-product', result);
  }
);

ipcMain.on(
  'get-product-by-category',
  async (event, getProductByCategoryInput: GetProductByCategoryInput) => {
    const result = await productService.getProductByCategory(
      getProductByCategoryInput
    );
    event.reply('get-product-by-category', result);
  }
);
