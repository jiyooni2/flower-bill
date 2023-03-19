import { GetBusinessInput } from './dtos/get-business.dto';
import { DeleteBusinessInput } from './dtos/delete-business.dto';
import { UpdateBusinessInput } from './dtos/update-busiess.dto';
import { GetBusinessesInput } from './dtos/get-businesses.dto';
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

ipcMain.on(
  'get-businesses',
  async (event, getBusinessesInput: GetBusinessesInput) => {
    authService.checkAuth(getBusinessesInput.token);
    const result = await businessService.getBusinesses(getBusinessesInput);
    event.reply('get-businesses', result);
  }
);

ipcMain.on(
  'update-business',
  async (event, updateBusinessInput: UpdateBusinessInput) => {
    authService.checkAuth(updateBusinessInput.token);
    const result = await businessService.updateBusiness(updateBusinessInput);
    event.reply('update-business', result);
  }
);

ipcMain.on(
  'delete-business',
  async (event, deleteBusinessInput: DeleteBusinessInput) => {
    authService.checkAuth(deleteBusinessInput.token);
    const result = await businessService.deleteBusiness(deleteBusinessInput);
    event.reply('delete-business', result);
  }
);

ipcMain.on("get-business",
async(event,getBusinessInput:GetBusinessInput)=>{
  authService.checkAuth(getBusinessInput.token);
  const result = await businessService.getBusiness(getBusinessInput);
  event.reply("get-business",result);
})
