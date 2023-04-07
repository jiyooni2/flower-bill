import { CheckPasswordInput } from '../auth/dtos/check-password.dto';
import { ipcMain } from 'electron';
import { ownerService } from '../main';
import { CreateOwnerInput } from './dtos/create-owner.dto';
import { UpdateOwnerInput } from './dtos/update-owner.dto';
import { authService } from './../main';
import { LoginInput } from '../auth/dtos/login.dto';
import { ChangePasswordInput } from '../auth/dtos/change-password.dto';

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

ipcMain.on(
  'check-password',
  async (event, checkPasswordInput: CheckPasswordInput) => {
    await authService.checkAuth(checkPasswordInput.token);
    const result = await authService.checkPassword(checkPasswordInput);
    event.reply('check-password', result);
  }
);

ipcMain.on(
  'change-password',
  async (event, changePasswordInput: ChangePasswordInput) => {
    await authService.changePassword(changePasswordInput);
    const result = await authService.changePassword(changePasswordInput);
    event.reply('change-password', result);
  }
);
