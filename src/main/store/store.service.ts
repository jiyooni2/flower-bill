import { Raw, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { AppDataSource } from './../main';
import { CreateStoreInput, CreateStoreOutput } from './dtos/create-store.dto';
import { SearchStoreInput, SearchStoreOutput } from './dtos/search-store.dto';
import { UpdateStoreInput, UpdateStoreOutput } from './dtos/update-store.dto';

export class StoreService {
  private readonly storeRepository: Repository<Store>;

  constructor() {
    this.storeRepository = AppDataSource.getRepository(Store);
  }

  async createStore(
    createStoreInput: CreateStoreInput
  ): Promise<CreateStoreOutput> {
    try {
      await this.storeRepository
        .createQueryBuilder()
        .insert()
        .into(Store)
        .values(createStoreInput)
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async searchStore({ keyword }: SearchStoreInput): Promise<SearchStoreOutput> {
    try {
      const stores = await this.storeRepository
        .createQueryBuilder(Store.name)
        .select()
        .where(`name LIKE "%${keyword}%"`)
        .getMany();

      console.log(stores);

      return { ok: true, stores };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateStore(
    updateStoreInput: UpdateStoreInput
  ): Promise<UpdateStoreOutput> {
    try {
      const { id } = updateStoreInput;

      await AppDataSource.createQueryBuilder()
        .update(Store)
        .set(updateStoreInput)
        .where('id=:id', { id })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
