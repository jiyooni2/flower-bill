import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { AppDataSource } from './../main';
import { Owner } from './../owner/entities/owner.entity';
import {
  CreateBusinessInput,
  CreateBusinessOutput,
} from './dtos/create-business.dto';

export class BusinessService {
  private readonly businessRepository: Repository<Business>;
  private readonly ownerRepository: Repository<Owner>;

  constructor() {
    this.businessRepository = AppDataSource.getRepository(Business);
    this.ownerRepository = AppDataSource.getRepository(Owner);
  }

  //service for API
  async createBusiness(
    createBusinessInput: CreateBusinessInput
  ): Promise<CreateBusinessOutput> {
    try {
      //owner 검증

      const owner = this.ownerRepository.findOne({
        where: { id: createBusinessInput.ownerId },
      });

      if (!owner) {
        return { ok: false, error: '없는 계정입니다.' };
      }

      await this.businessRepository
        .createQueryBuilder()
        .insert()
        .into(Business)
        .values(createBusinessInput)
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  //service not for API
  async getBusiness(id: number) {
    return this.businessRepository.findOne({ where: { id } });
  }

  async validateBusiness(id: number) {
    const business = this.getBusiness(id);
    if (!business) {
      throw new Error('없는 사업자입니다.');
    }
  }
}
