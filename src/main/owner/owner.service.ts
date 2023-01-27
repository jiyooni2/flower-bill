import { Repository } from 'typeorm';
import { AppDataSource } from '../main';
import { CreateOwnerOutput, CreateOwnerInput } from './dtos/create-owner.dto';
import { UpdateOwnerInput, UpdateOwnerOutput } from './dtos/update-owner.dto';
import { Owner } from './entities/owner.entity';

export class OwnerService {
  private readonly ownerRepository: Repository<Owner>;

  constructor() {
    this.ownerRepository = AppDataSource.getRepository(Owner);
  }

  async createOwner(
    createOwnerInput: CreateOwnerInput
  ): Promise<CreateOwnerOutput> {
    try {
      await this.ownerRepository
        .createQueryBuilder()
        .insert()
        .into(Owner)
        .values(createOwnerInput)
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateOwner({
    id,
    ...updateOwnerInput
  }: UpdateOwnerInput): Promise<UpdateOwnerOutput> {
    try {
      const user = await this.ownerRepository.findOne({ where: { id } });

      if (!user) {
        return { ok: false, error: '없는 유저입니다.' };
      }

      await this.ownerRepository.update({ id }, { ...updateOwnerInput });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
