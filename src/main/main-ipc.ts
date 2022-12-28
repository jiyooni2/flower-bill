import { ipcMain } from 'electron';
import { billService, productService, storeService, userService } from './main';
import { CreateBillInput } from './bill/dtos/create-bill.dto';
import { CreateStoreInput } from './store/dtos/create-store.dto';
import { UpdateBillInput } from './bill/dtos/update-bill.dto';
import { SearchStoreInput } from './store/dtos/search-store.dto';
import { GetStoresInput, GetStoresOutput } from './store/dtos/get-stores.dto';
import {
  DeleteStoreInput,
  DeleteStoreOutput,
} from './store/dtos/delete-store.dto';
import { CreateUserInput, CreateUserOutput } from './user/dtos/create-user.dto';
import {
  UpdateStoreInput,
  UpdateStoreOutput,
} from './store/dtos/update-store.dto';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

//bill
ipcMain.on('create-bill', async (event, createBillInput: CreateBillInput) => {
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

ipcMain.on('get-products', async (event, arg) => {
  const products = await productService.getProducts();
  event.reply('get-products', products);
});

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
  event.reply('update-store', result);
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

ipcMain.on('create-user', async (event, createUserInput: CreateUserInput) => {
  const result: CreateUserOutput = await userService.createUser(
    createUserInput
  );
  event.reply('create-user', result);
});
