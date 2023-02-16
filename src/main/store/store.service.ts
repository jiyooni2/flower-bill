import { Raw, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { AppDataSource, authService } from './../main';
import { CreateStoreInput, CreateStoreOutput } from './dtos/create-store.dto';
import { SearchStoreInput, SearchStoreOutput } from './dtos/search-store.dto';
import { UpdateStoreInput, UpdateStoreOutput } from './dtos/update-store.dto';
import { GetStoresInput, GetStoresOutput } from './dtos/get-stores.dto';
import { DeleteStoreInput, DeleteStoreOutput } from './dtos/delete-store.dto';
import { GetStoreInput, GetStoreOutput } from './dtos/get-store.dto';

export class StoreService {
  private readonly storeRepository: Repository<Store>;

  constructor() {
    this.storeRepository = AppDataSource.getRepository(Store);
  }

  async createStore({
    name,
    businessNumber,
    owner,
    address,
    token,
    businessId,
  }: CreateStoreInput): Promise<CreateStoreOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      await this.storeRepository
        .createQueryBuilder()
        .insert()
        .into(Store)
        .values({ name, businessNumber, owner, address, businessId })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async searchStore({
    page,
    keyword,
    token,
    businessId,
  }: SearchStoreInput): Promise<SearchStoreOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const stores = await this.storeRepository
        .createQueryBuilder(Store.name)
        .select()
        .where(`name LIKE "%${keyword}%"`)
        .andWhere('businessId=:businessId', { businessId })
        .offset(page)
        .limit(10)
        .getMany();

      return { ok: true, stores };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateStore({
    id,
    businessNumber,
    name,
    address,
    owner,
    businessId,
    token,
  }: UpdateStoreInput): Promise<UpdateStoreOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const store = await this.storeRepository.findOne({ where: { id } });

      if (!store) {
        return { ok: false, error: '없는 스토어입니다.' };
      }

      if (store.businessId !== businessId) {
        return { ok: false, error: '해당 스토어에 대한 권한이 없습니다.' };
      }
      //1. store가 해당 비즈니스의 store인지
      await this.storeRepository
        .createQueryBuilder()
        .update(Store)
        .set({
          businessNumber,
          name,
          address,
          owner,
        })
        .where('id=:id', { id })
        .andWhere('businessId=:businessId', { businessId })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getStores({
    page,
    token,
    businessId,
  }: GetStoresInput): Promise<GetStoresOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const stores = await this.storeRepository
        .createQueryBuilder(Store.name)
        .select()
        .where(`businessId=:businessId`, { businessId })
        .offset(page)
        .limit(10)
        .getMany();

      return { ok: true, stores };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteStore({
    id,
    token,
    businessId,
  }: DeleteStoreInput): Promise<DeleteStoreOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const store = await this.storeRepository.findOne({ where: { id } });

      if (!store) {
        return { ok: false, error: '없는 스토어입니다.' };
      }

      if (store.businessId !== businessId) {
        return { ok: false, error: '해당 스토어에 대한 권한이 없습니다.' };
      }

      await this.storeRepository
        .createQueryBuilder(Store.name)
        .delete()
        .where('id=:id', { id })
        .andWhere('businessId=:businessId', { businessId })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getStore({
    id,
    token,
    businessId,
  }: GetStoreInput): Promise<GetStoreOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const store = await this.storeRepository.findOne({
        where: { id },
      });

      if (!store) {
        return { ok: false, error: '없는 스토어입니다.' };
      }

      if (store.businessId !== businessId) {
        return { ok: false, error: '해당 스토어에 대한 권한이 없습니다.' };
      }

      return { ok: true, store };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
