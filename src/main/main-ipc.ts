import { ipcMain } from 'electron';
import {
  billService,
  categoryService,
  productService,
  storeService,
  ownerService,
  businessService,
} from './main';
import { CreateBillInput } from './bill/dtos/create-bill.dto';
import { CreateStoreInput } from './store/dtos/create-store.dto';
import { UpdateBillInput } from './bill/dtos/update-bill.dto';
import { SearchStoreInput } from './store/dtos/search-store.dto';
import { GetStoresInput, GetStoresOutput } from './store/dtos/get-stores.dto';
import {
  DeleteStoreInput,
  DeleteStoreOutput,
} from './store/dtos/delete-store.dto';
import {
  CreateOwnerInput,
  CreateOwnerOutput,
} from './owner/dtos/create-owner.dto';
import {
  CreateProductInput,
  CreateProductOutput,
} from './product/dtos/create-product.dto';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './category/dtos/create-category.dto';
import {
  UpdateProductOutput,
  UpdateProductInput,
} from './product/dtos/update-product.dto';
import {
  DeleteProductInput,
  DeleteProductOutput,
} from './product/dtos/delete-product.dto';
import {
  UpdateOwnerInput,
  UpdateOwnerOutput,
} from './owner/dtos/update-owner.dto';
import {
  UpdateStoreInput,
  UpdateStoreOutput,
} from './store/dtos/update-store.dto';
import {
  GetProductByCategoryInput,
  GetProductByCategoryOutput,
} from './product/dtos/get-product-by-category.dto';
import { GetProductsInput } from './product/dtos/get-products.dto';
import { GetStoreInput } from './store/dtos/get-store.dto';
import { GetCategoryInput } from './category/dtos/get-category.dto';
import { SearchProductInput } from './product/dtos/search-product.dto';
import { CreateBusinessInput } from './business/dtos/create-business.dto';
import {
  GetBillByStoreOutput,
  GetBillByStoreInput,
} from './bill/dtos/get-bill-by-store.dto';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

//bill
ipcMain.on('create-bill', async (event, createBillInput: CreateBillInput) => {
  //if not auth, return
  const result = await billService.createBill(createBillInput);
  event.reply('create-bill', result);
});

ipcMain.on('get-bill', async (event, arg) => {
  const result = await billService.getBill(arg);
  event.reply('get-bill', result);
});

ipcMain.on('delete-bill', async (event, arg) => {
  const result = await billService.deleteBill(arg);
  event.reply('delete-bill', result);
});

ipcMain.on('update-bill', async (event, updateBIllInput: UpdateBillInput) => {
  const result = await billService.updateBill(updateBIllInput);
  event.reply('update-bill', result);
});

ipcMain.on(
  'get-bill-by-store',
  async (event, getBillByStoreInput: GetBillByStoreInput) => {
    const result: GetBillByStoreOutput = await billService.getBillByStore(
      getBillByStoreInput
    );

    event.reply('get-bill-by-store', result);
  }
);

ipcMain.on(
  'get-products',
  async (event, getProductsInput: GetProductsInput) => {
    const products = await productService.getProducts(getProductsInput);
    event.reply('get-products', products);
  }
);

ipcMain.on(
  'create-store',
  async (event, createStoreInput: CreateStoreInput) => {
    const result = await storeService.createStore(createStoreInput);
    event.reply('create-store', result);
  }
);

ipcMain.on(
  'search-store',
  async (event, searchStoreInput: SearchStoreInput) => {
    const result = await storeService.searchStore(searchStoreInput);
    event.reply('search-store', result);
  }
);

ipcMain.on(
  'update-store',
  async (event, updateStoreInput: UpdateStoreInput) => {
    const result: UpdateStoreOutput = await storeService.updateStore(
      updateStoreInput
    );
    event.reply('update-store', result);
  }
);

ipcMain.on('get-stores', async (event, getStoresInput: GetStoresInput) => {
  const result: GetStoresOutput = await storeService.getStores(getStoresInput);
  event.reply('get-stores', result);
});

ipcMain.on('get-store', async (event, getStoreInput: GetStoreInput) => {
  const result = await storeService.getStore(getStoreInput);
  event.reply('get-store', result);
});

ipcMain.on(
  'delete-store',
  async (event, deleteStoreInput: DeleteStoreInput) => {
    const result: DeleteStoreOutput = await storeService.deleteStore(
      deleteStoreInput
    );
    event.reply('delete-store', result);
  }
);

ipcMain.on('create-user', async (event, createUserInput: CreateOwnerInput) => {
  const result = await ownerService.createOwner(createUserInput);
  event.reply('create-user', result);
});

ipcMain.on(
  'create-product',
  async (event, createProductInput: CreateProductInput) => {
    const result: CreateProductOutput = await productService.createProduct(
      createProductInput
    );
    event.reply('create-product', result);
  }
);

ipcMain.on(
  'create-category',
  async (event, createCategoryInput: CreateCategoryInput) => {
    const result: CreateCategoryOutput = await categoryService.createCategory(
      createCategoryInput
    );

    event.reply('create-category', result);
  }
);

ipcMain.on(
  'get-category',
  async (event, getCategoryInput: GetCategoryInput) => {
    const result = await categoryService.getCategory(getCategoryInput);
    event.reply('get-category', result);
  }
);

ipcMain.on(
  'update-product',
  async (event, updateProductInput: UpdateProductInput) => {
    const result: UpdateProductOutput = await productService.updateProduct(
      updateProductInput
    );
    event.reply('update-product', result);
  }
);

ipcMain.on(
  'delete-product',
  async (event, deleteProductInput: DeleteProductInput) => {
    const result: DeleteProductOutput = await productService.deleteProduct(
      deleteProductInput
    );

    event.reply('delete-product', result);
  }
);

ipcMain.on('update-user', async (event, updateUserInput: UpdateOwnerInput) => {
  const result: UpdateOwnerOutput = await ownerService.updateOwner(
    updateUserInput
  );
  event.reply('update-user', result);
});

ipcMain.on(
  'get-product-by-category',
  async (event, getProductByCategoryInput: GetProductByCategoryInput) => {
    const result: GetProductByCategoryOutput =
      await productService.getProductByCategory(getProductByCategoryInput);
    event.reply('get-product-by-category', result);
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
  'create-business',
  async (event, createBusinessInput: CreateBusinessInput) => {
    const result = await businessService.createBusiness(createBusinessInput);
    event.reply('create-business', result);
  }
);
