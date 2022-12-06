import { ipcMain } from 'electron';
import { billService, productService } from './main';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

//bill
ipcMain.on('create-bill', async (event, arg) => {
  const result = await billService.createBill({ memo: arg.memo });
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

ipcMain.on('get-products', async (event, arg) => {
  const products = await productService.getProducts();
  event.reply('get-products', products);
});
