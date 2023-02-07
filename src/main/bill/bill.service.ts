import {
  AppDataSource,
  authService,
  businessService,
  ownerService,
  storeService,
} from '../main';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dtos/create-bill.dto';
import { GetBillInput, GetBillOutput } from './dtos/get-bill.dto';
import { DeleteBillInput, DeleteBillOutput } from './dtos/delete-bill.dto';
import { UpdateBillInput, UpdateBillOutput } from './dtos/update-bill.dto';
import { OrderProduct } from './../orderProduct/entities/orderProduct.entity';
import {
  GetBillByStoreOutput,
  GetBillByStoreInput,
} from './dtos/get-bill-by-store.dto';

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
    businessId,
    orderProductInputs,
    token,
  }: CreateBillInput) {
    try {
      //need transaction

      await authService.checkBusinessAuth(token, businessId);

      const { store } = await storeService.getStore({ id: storeId });
      if (!store) {
        return { ok: false, error: '존재하지 않는 스토어입니다.' };
      }

      //insert bill
      const bill = new Bill();
      bill.storeId = storeId;
      bill.transactionDate = transactionDate;
      bill.memo = memo;
      bill.businessId = businessId;

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

      if (!bill) {
        return { ok: false, error: '존재하지 않는 계산서입니다.' };
      }

      return { ok: true, bill };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteBill({ id }: DeleteBillInput): Promise<DeleteBillOutput> {
    try {
      const bill = await this.billRepository.findOne({ where: { id } });

      if (!bill) {
        return { ok: false, error: '존재하지 않는 계산서입니다.' };
      }

      await this.billRepository.delete({ id });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateBill({
    id,
    orderProductInputs,
    ...updateBillInput
  }: UpdateBillInput): Promise<UpdateBillOutput> {
    try {
      const bill = await this.billRepository.findOne({ where: { id } });

      if (!bill) {
        return { ok: false, error: '없는 게산서입니다.' };
      }

      if (updateBillInput.storeId) {
        const { store } = await storeService.getStore({
          id: updateBillInput.storeId,
        });
        if (!store) {
          return { ok: false, error: '없는 스토어입니다.' };
        }
      }

      if (orderProductInputs) {
        //기존의 orderProducts 삭제
        await this.orderProductRepository.delete({ billId: bill.id });

        const orderProducts = [];
        for (const orderProductInput of orderProductInputs) {
          let orderProduct = new OrderProduct();
          orderProduct = { ...orderProduct, ...orderProductInput, bill };
          orderProducts.push(orderProduct);
        }
        await this.orderProductRepository
          .createQueryBuilder()
          .insert()
          .into(OrderProduct)
          .values(orderProducts)
          .execute();
      }

      await this.billRepository.update({ id }, { ...updateBillInput });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getBillByStore({
    storeId,
    page,
  }: GetBillByStoreInput): Promise<GetBillByStoreOutput> {
    try {
      const { store } = await storeService.getStore({ id: storeId });
      if (!store) {
        return { ok: false, error: '없는 스토어입니다.' };
      }

      const bills = await this.billRepository
        .createQueryBuilder()
        .select()
        .where('storeId=:storeId', { storeId: store.id })
        .orderBy('bill.id')
        .offset(page)
        .limit(10)
        .getMany();

      return { ok: true, bills };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
