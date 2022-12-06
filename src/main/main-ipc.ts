import { ipcMain } from 'electron';
import { billService, productService } from './main';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('create-bill', async (event, arg) => {
  await billService.createBill({ memo: 'AA' });
  event.reply('create-bill', 'PONG');
});

ipcMain.on('get-products', async (event, arg) => {
  const products = await productService.getProducts();
  event.reply('get-products', products);
});
