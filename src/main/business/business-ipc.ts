import { ipcMain } from 'electron';
import { businessService } from '../main';
import { CreateBusinessInput } from './dtos/create-business.dto';
import { authService } from './../main';

ipcMain.on(
  'create-business',
  async (event, createBusinessInput: CreateBusinessInput) => {
    authService.checkAuth(createBusinessInput.token);
    const result = await businessService.createBusiness(createBusinessInput);
    event.reply('create-business', result);
  }
);
