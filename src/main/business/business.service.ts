import { GetBusinessOutput, GetBusinessInput } from './dtos/get-business.dto';
import {
  DeleteBusinessInput,
  DeleteBusinessOutput,
} from './dtos/delete-business.dto';
import {
  UpdateBusinessInput,
  UpdateBusinessOutPut,
} from './dtos/update-busiess.dto';
import {
  GetBusinessesInput,
  GetBusinessesOutput,
} from './dtos/get-businesses.dto';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { AppDataSource, authService } from './../main';
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
  async createBusiness({
    name,
    businessNumber,
    businessOwnerName,
    address,
    typeofBusiness,
    sector,
    token,
    accountBank,
    accountNumber,
    accountOwner,
  }: CreateBusinessInput): Promise<CreateBusinessOutput> {
    try {
      //owner 검증

      const owner = await authService.getAuthOwner(token);

      if (!owner) {
        return { ok: false, error: '없는 계정입니다.' };
      }

      await this.businessRepository
        .createQueryBuilder()
        .insert()
        .into(Business)
        .values({
          name,
          businessNumber,
          businessOwnerName,
          address,
          typeofBusiness,
          sector,
          ownerId: owner.id,
          accountNumber,
          accountBank,
          accountOwner,
        })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getBusinesses({
    token,
  }: GetBusinessesInput): Promise<GetBusinessesOutput> {
    try {
      const owner = await authService.getAuthOwner(token);

      if (!owner) {
        return { ok: false, error: '없는 사용자입니다.' };
      }

      const businesses = await this.businessRepository.find({
        where: { ownerId: owner.id },
      });

      return { ok: true, businesses };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateBusiness({
    businessId,
    token,
    businessNumber,
    businessOwnerName,
    address,
    typeofBusiness,
    sector,
    name,
    accountNumber,
    accountBank,
    accountOwner,
  }: UpdateBusinessInput): Promise<UpdateBusinessOutPut> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      await this.businessRepository.update(
        { id: businessId },
        {
          businessNumber,
          businessOwnerName,
          address,
          name,
          typeofBusiness,
          sector,
          accountNumber,
          accountBank,
          accountOwner,
        }
      );

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteBusiness({
    businessId,
    token,
  }: DeleteBusinessInput): Promise<DeleteBusinessOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      await this.businessRepository.delete({ id: businessId });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getBusiness({
    token,
    id,
  }: GetBusinessInput): Promise<GetBusinessOutput> {
    try {
      await authService.checkBusinessAuth(token, id);

      const business = await this.businessRepository.findOne({ where: { id } });

      if (!business) {
        return { ok: false, error: '존재하지 않는 사업자입니다.' };
      }

      return { ok: true, business };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async validateBusiness(id: number) {
    const business = this.businessRepository.findOne({ where: { id } });
    if (!business) {
      throw new Error('없는 사업자입니다.');
    }
  }
}
