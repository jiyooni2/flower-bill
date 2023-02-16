import { ipcMain } from 'electron';
import { GetProductsInput } from './dtos/get-products.dto';
import { productService } from '../main';
import { CreateProductInput } from './dtos/create-product.dto';
import { UpdateProductInput } from './dtos/update-product.dto';
import { DeleteProductInput } from './dtos/delete-product.dto';
import { SearchProductInput } from './dtos/search-product.dto';
import { GetProductByCategoryInput } from './dtos/get-product-by-category.dto';
import { authService } from './../main';

ipcMain.on(
  'get-products',
  async (event, getProductsInput: GetProductsInput) => {
    await authService.checkAuth(getProductsInput.token);
    const products = await productService.getProducts(getProductsInput);
    event.reply('get-products', products);
  }
);

ipcMain.on(
  'create-product',
  async (event, createProductInput: CreateProductInput) => {
    await authService.checkAuth(createProductInput.token);

    const result = await productService.createProduct(createProductInput);
    event.reply('create-product', result);
  }
);

ipcMain.on(
  'update-product',
  async (event, updateProductInput: UpdateProductInput) => {
    await authService.checkAuth(updateProductInput.token);

    const result = await productService.updateProduct(updateProductInput);
    event.reply('update-product', result);
  }
);

ipcMain.on(
  'delete-product',
  async (event, deleteProductInput: DeleteProductInput) => {
    await authService.checkAuth(deleteProductInput.token);

    const result = await productService.deleteProduct(deleteProductInput);

    event.reply('delete-product', result);
  }
);

ipcMain.on(
  'search-product',
  async (event, searchProductInput: SearchProductInput) => {
    await authService.checkAuth(searchProductInput.token);

    const result = await productService.searchProduct(searchProductInput);
    event.reply('search-product', result);
  }
);

ipcMain.on(
  'get-product-by-category',
  async (event, getProductByCategoryInput: GetProductByCategoryInput) => {
    await authService.checkAuth(getProductByCategoryInput.token);

    const result = await productService.getProductByCategory(
      getProductByCategoryInput
    );
    event.reply('get-product-by-category', result);
  }
);
