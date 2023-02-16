import { LoginInput, LoginOutput } from './dtos/login.dto';
import * as jwt from 'jsonwebtoken';
import { Owner } from './../main/owner/entities/owner.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { businessService } from '../main/main';

export class AuthService {
  private readonly ownerRepository: Repository<Owner>;
  private readonly ACCESS_KEY = 'AAA';

  constructor() {}

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

  //validate token
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

  //get owner
  async getAuthOwner(token?: string): Promise<Owner | null> {
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, this.ACCESS_KEY);

    if (typeof decoded === 'object' && decoded.hasOwnProperty('data')) {
      const owner = this.ownerRepository.findOne({
        where: { id: decoded.data },
      });

      if (!owner) {
        return null;
      } else {
        return owner;
      }
    } else {
      return null;
    }
  }

  //validate business
  async checkBusinessAuth(token: string, businessId: number) {
    const owner = await this.getAuthOwner(token);

    if (!owner) {
      throw new Error('존재하지 않는 유저입니다.');
    }

    const business = await businessService.getBusiness(businessId);

    if (!business) {
      throw new Error('존재하지 않는 사업자입니다.');
    }

    if (business?.ownerId !== owner.id) {
      throw new Error('해당 사업자에 대한 권한이 없습니다.');
    }
  }
}
