import { AppDataSource } from '../main';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dtos/create-bill.dto';
import { GetBillInput, GetBillOutput } from './dtos/get-bill.dto';
import { DeleteBillInput, DeleteBillOutput } from './dtos/delete-bill.dto';
import { UpdateBillInput, UpdateBillOutput } from './dtos/update-bill.dto';
import { OrderProduct } from './../orderProduct/entities/orderProduct.entity';

export class BillService {
  private readonly billRepository: Repository<Bill>;
  private readonly orderProductRepository: Repository<OrderProduct>;

  constructor() {
    this.billRepository = AppDataSource.getRepository(Bill);
    this.orderProductRepository = AppDataSource.getRepository(OrderProduct);
  }

  async createBill({
    memo,
    transactionDate,
    storeId,
    orderProductInputs,
  }: CreateBillInput) {
    try {
      //need transaction

      //insert bill
      const bill = new Bill();
      bill.storeId = storeId;
      bill.transactionDate = transactionDate;
      bill.memo = memo;

      await this.billRepository.save(bill);

      const orderProducts = [];
      for (const { count, productId, orderPrice } of orderProductInputs) {
        const orderProduct = new OrderProduct();
        orderProduct.count = count;
        orderProduct.productId = productId;
        orderProduct.bill = bill;
        orderProduct.orderPrice = orderPrice;
        orderProducts.push(orderProduct);
      }

      //need to separate logic
      //bulk insert orderProduct
      await this.orderProductRepository
        .createQueryBuilder()
        .insert()
        .into(OrderProduct)
        .values(orderProducts)
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

  async deleteBill({ id }: DeleteBillInput): Promise<DeleteBillOutput> {
    try {
      await this.billRepository.delete({ id });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateBill(
    updateBillInput: UpdateBillInput
  ): Promise<UpdateBillOutput> {
    try {
      const { id } = updateBillInput;
      await AppDataSource.createQueryBuilder()
        .update(Bill)
        .set(updateBillInput)
        .where('id=:id', { id })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
