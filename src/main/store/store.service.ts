import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { AppDataSource } from './../main';
import { CreateStoreInput, CreateStoreOutput } from './dtos/create-store.dto';

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
}
