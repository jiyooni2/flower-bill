import { GetBillsInput } from './dtos/get-bills.dto';
import { ipcMain } from 'electron';
import { billService } from '../main';
import { CreateBillInput } from './dtos/create-bill.dto';
import { GetBillInput } from './dtos/get-bill.dto';
import { DeleteBillInput } from './dtos/delete-bill.dto';
import { UpdateBillInput } from './dtos/update-bill.dto';
import { GetBillByStoreInput } from './dtos/get-bill-by-store.dto';
import { authService } from './../main';

ipcMain.on('create-bill', async (event, createBillInput: CreateBillInput) => {
  await authService.checkAuth(createBillInput.token);
  const result = await billService.createBill(createBillInput);
  event.reply('create-bill', result);
});

ipcMain.on('get-bill', async (event, getBillInput: GetBillInput) => {
  await authService.checkAuth(getBillInput.token);
  const result = await billService.getBill(getBillInput);
  event.reply('get-bill', result);
});

ipcMain.on('delete-bill', async (event, deleteBillInput: DeleteBillInput) => {
  await authService.checkAuth(deleteBillInput.token);
  const result = await billService.deleteBill(deleteBillInput);
  event.reply('delete-bill', result);
});

ipcMain.on('update-bill', async (event, updateBIllInput: UpdateBillInput) => {
  await authService.checkAuth(updateBIllInput.token);
  const result = await billService.updateBill(updateBIllInput);
  event.reply('update-bill', result);
});

ipcMain.on(
  'get-bill-by-store',
  async (event, getBillByStoreInput: GetBillByStoreInput) => {
    await authService.checkAuth(getBillByStoreInput.token);
    const result = await billService.getBillByStore(getBillByStoreInput);
    event.reply('get-bill-by-store', result);
  }
);

ipcMain.on('get-bills', async (event, getBillsInput: GetBillsInput) => {
  await authService.checkAuth(getBillsInput.token);
  const result = await billService.getBills(getBillsInput);
  event.reply('get-bills', result);
});
