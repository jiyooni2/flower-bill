import { ipcMain } from 'electron';
import { ownerService } from '../main';
import { CreateOwnerInput } from './dtos/create-owner.dto';
import { UpdateOwnerInput } from './dtos/update-owner.dto';
import { authService } from './../main';
import { LoginInput } from './../../auth/dtos/login.dto';

ipcMain.on(
  'create-owner',
  async (event, createOwnerInput: CreateOwnerInput) => {
    const result = await ownerService.createOwner(createOwnerInput);
    event.reply('create-owner', result);
  }
);

ipcMain.on(
  'update-owner',
  async (event, updateOwnerInput: UpdateOwnerInput) => {
    await authService.checkAuth(updateOwnerInput.token);
    const result = await ownerService.updateOwner(updateOwnerInput);
    event.reply('update-owner', result);
  }
);

ipcMain.on('login', async (event, loginInput: LoginInput) => {
  const result = await authService.login(loginInput);
  event.reply('login', result);
});
