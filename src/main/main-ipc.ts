import { ipcMain } from 'electron';
import { billService, productService, storeService } from './main';
import { CreateBillInput } from './bill/dtos/create-bill.dto';
import { CreateStoreInput } from './store/dtos/create-store.dto';
import { UpdateBillInput } from './bill/dtos/update-bill.dto';

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
