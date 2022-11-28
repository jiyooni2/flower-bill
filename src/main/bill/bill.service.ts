import { AppDataSource } from '../main';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dtos/create-bill.dto';

export class BillService {
  private readonly billRepository: Repository<Bill>;

  constructor() {
    this.billRepository = AppDataSource.getRepository(Bill);
  }

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
