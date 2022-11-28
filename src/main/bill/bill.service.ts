import { AppDataSource } from '../main';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dtos/create-bill.dto';

export class BillService {
  readonly billRepository: Repository<Bill>;

  constructor() {
    this.billRepository = AppDataSource.getRepository(Bill);
  }

  async createBill(createBillInput: CreateBillInput) {
    try {
      console.log('CREATE BILL START', createBillInput);
      await this.billRepository
        .createQueryBuilder()
        .insert()
        .into(Bill)
        .values(createBillInput)
        .execute();

      console.log('CREATE BILL');
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
