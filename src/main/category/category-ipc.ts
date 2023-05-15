import { UpdateCategoryInput } from './dtos/update-category.dto';
import { GetCategoriesInput } from './dtos/get-categories.dto';
import { ipcMain } from 'electron';
import { CreateCategoryInput } from './dtos/create-category.dto';
import { categoryService } from '../main';
import { GetCategoryInput } from './dtos/get-category.dto';
import { authService } from './../main';
import { DeleteCategoryInput } from './dtos/delete-category.dto';

ipcMain.on(
  'create-category',
  async (event, createCategoryInput: CreateCategoryInput) => {
    await authService.checkAuth(createCategoryInput.token);
    const result = await categoryService.createCategory(createCategoryInput);
    event.reply('create-category', result);
  }
);

ipcMain.on(
  'get-category',
  async (event, getCategoryInput: GetCategoryInput) => {
    await authService.checkAuth(getCategoryInput.token);
    const result = await categoryService.getCategory(getCategoryInput);
    event.reply('get-category', result);
  }
);

ipcMain.on(
  'get-categories',
  async (event, getCategoriesInput: GetCategoriesInput) => {
    await authService.checkAuth(getCategoriesInput.token);
    const result = await categoryService.getCategories(getCategoriesInput);
    event.reply('get-categories', result);
  }
);

ipcMain.on(
  'update-category',
  async (event, updateCategoryInput: UpdateCategoryInput) => {
    await authService.checkAuth(updateCategoryInput.token);
    const result = await categoryService.updateCategory(updateCategoryInput);
    event.reply('update-category', result);
  }
);

ipcMain.on(
  'delete-category',
  async (event, deleteCategoryInput: DeleteCategoryInput) => {
    await authService.checkAuth(deleteCategoryInput.token);
    const result = await categoryService.deleteCategory(deleteCategoryInput);
    event.reply('delete-category', result);
  }
);
