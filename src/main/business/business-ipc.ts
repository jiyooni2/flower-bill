import { ipcMain } from 'electron';
import { businessService } from '../main';
import { CreateBusinessInput } from './dtos/create-business.dto';

ipcMain.on(
  'create-business',
  async (event, createBusinessInput: CreateBusinessInput) => {
    const result = await businessService.createBusiness(createBusinessInput);
    event.reply('create-business', result);
  }
);
