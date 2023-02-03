import { Repository } from 'typeorm';
import { AppDataSource } from '../main';
import { CreateOwnerOutput, CreateOwnerInput } from './dtos/create-owner.dto';
import { UpdateOwnerInput, UpdateOwnerOutput } from './dtos/update-owner.dto';
import { Owner } from './entities/owner.entity';
import * as bcrypt from 'bcrypt';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import * as jwt from 'jsonwebtoken';

export class OwnerService {
  private readonly ownerRepository: Repository<Owner>;
  private readonly ACCESS_KEY = 'AAA';

  constructor() {
    this.ownerRepository = AppDataSource.getRepository(Owner);
  }

  async createOwner({
    ownerId,
    password,
    nickname,
  }: CreateOwnerInput): Promise<CreateOwnerOutput> {
    try {
      const existingOwner = await this.ownerRepository.findOne({
        where: { ownerId },
      });

      if (existingOwner) {
        return { ok: false, error: '이미 사용중인 ID입니다.' };
      }

      await this.ownerRepository
        .createQueryBuilder()
        .insert()
        .into(Owner)
        .values({
          ownerId,
          nickname,
          password: await bcrypt.hash(password, 10),
        })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateOwner({
    id,
    nickname,
    password,
  }: UpdateOwnerInput): Promise<UpdateOwnerOutput> {
    try {
      const owner = await this.ownerRepository.findOne({ where: { id } });

      if (!owner) {
        return { ok: false, error: '없는 사용자입니다.' };
      }

      await this.ownerRepository.update(
        { id },
        {
          nickname,
          password: password ? await bcrypt.hash(password, 10) : undefined,
        }
      );

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async login({ ownerId, password }: LoginInput): Promise<LoginOutput> {
    try {
      const owner = await this.ownerRepository.findOne({ where: { ownerId } });
      if (!owner) {
        return { ok: false, error: '없는 사용자입니다.' };
      }

      const isMatched = await bcrypt.compare(password, owner.password);
      if (!isMatched) {
        return { ok: false, error: '비밀번호를 확인해주세요.' };
      }

      const token = jwt.sign({ data: owner.id?.toString() }, this.ACCESS_KEY);

      return { ok: true, token };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async checkAuth(token?: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    if (token == null) {
      return false;
    }

    const decoded = jwt.verify(token, this.ACCESS_KEY);

    if (typeof decoded === 'object' && decoded.hasOwnProperty('data')) {
      const owner = this.ownerRepository.findOne({
        where: { id: decoded.data },
      });
      if (!owner) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
}
