import { ipcMain } from 'electron';
import { CreateCategoryInput } from './dtos/create-category.dto';
import { categoryService } from '../main';
import { GetCategoryInput } from './dtos/get-category.dto';

ipcMain.on(
  'create-category',
  async (event, createCategoryInput: CreateCategoryInput) => {
    const result = await categoryService.createCategory(createCategoryInput);

    event.reply('create-category', result);
  }
);

ipcMain.on(
  'get-category',
  async (event, getCategoryInput: GetCategoryInput) => {
    const result = await categoryService.getCategory(getCategoryInput);
    event.reply('get-category', result);
  }
);
