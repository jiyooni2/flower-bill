import { ipcMain } from 'electron';
import { storeService } from '../main';
import { SearchStoreInput } from './dtos/search-store.dto';
import { UpdateStoreInput } from './dtos/update-store.dto';
import { GetStoresInput } from './dtos/get-stores.dto';
import { GetStoreInput } from './dtos/get-store.dto';
import { DeleteStoreInput } from './dtos/delete-store.dto';
import { CreateStoreInput } from './dtos/create-store.dto';
import { authService } from './../main';

ipcMain.on(
  'create-store',
  async (event, createStoreInput: CreateStoreInput) => {
    await authService.checkAuth(createStoreInput.token);
    const result = await storeService.createStore(createStoreInput);
    event.reply('create-store', result);
  }
);

ipcMain.on(
  'search-store',
  async (event, searchStoreInput: SearchStoreInput) => {
    await authService.checkAuth(searchStoreInput.token);

    const result = await storeService.searchStore(searchStoreInput);
    event.reply('search-store', result);
  }
);

ipcMain.on(
  'update-store',
  async (event, updateStoreInput: UpdateStoreInput) => {
    await authService.checkAuth(updateStoreInput.token);
    const result = await storeService.updateStore(updateStoreInput);
    event.reply('update-store', result);
  }
);

ipcMain.on('get-stores', async (event, getStoresInput: GetStoresInput) => {
  await authService.checkAuth(getStoresInput.token);
  const result = await storeService.getStores(getStoresInput);
  event.reply('get-stores', result);
});

ipcMain.on('get-store', async (event, getStoreInput: GetStoreInput) => {
  await authService.checkAuth(getStoreInput.token);
  const result = await storeService.getStore(getStoreInput);
  event.reply('get-store', result);
});

ipcMain.on(
  'delete-store',
  async (event, deleteStoreInput: DeleteStoreInput) => {
    await authService.checkAuth(deleteStoreInput.token);
    const result = await storeService.deleteStore(deleteStoreInput);
    event.reply('delete-store', result);
  }
);
