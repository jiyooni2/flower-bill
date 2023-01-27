import { ipcMain } from 'electron';
import { ownerService } from '../main';
import { CreateOwnerInput } from './dtos/create-owner.dto';
import { UpdateOwnerInput } from './dtos/update-owner.dto';

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
    const result = await ownerService.updateOwner(updateOwnerInput);
    event.reply('update-owner', result);
  }
);
