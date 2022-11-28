import { appDataSource } from '../main';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dtos/create-bill.dto';

export class UserResolver {
  billRepository = appDataSource.getRepository(Bill);
  // constructor(billRepository: Repository<Bill>) {
  // }

  async createBill(createBillInput: CreateBillInput) {
    try {
      await this.billRepository
        .createQueryBuilder()
        .insert()
        .into(Bill)
        .values(createBillInput)
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
