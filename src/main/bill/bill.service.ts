import { AppDataSource } from '../main';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dtos/create-bill.dto';
import { GetBillInput, GetBillOutput } from './dtos/get-bill.dto';

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

  async getBill({ id }: GetBillInput): Promise<GetBillOutput> {
    try {
      const bill = await this.billRepository.findOne({ where: { id } });
      return { ok: true, bill: bill ? bill : undefined };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
