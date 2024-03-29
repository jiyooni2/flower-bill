import { Business } from '../business/entities/business.entity';
import { BillResult } from '../common/dtos/bill-result.dto';
import { GetBillsInput, GetBillsOutput } from './dtos/get-bills.dto';
import { AppDataSource, authService } from '../main';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dtos/create-bill.dto';
import { GetBillInput, GetBillOutput } from './dtos/get-bill.dto';
import { DeleteBillInput, DeleteBillOutput } from './dtos/delete-bill.dto';
import { UpdateBillInput, UpdateBillOutput } from './dtos/update-bill.dto';
import { OrderProduct } from '../orderProduct/entities/orderProduct.entity';
import { Store } from '../store/entities/store.entity';
import {
  GetBillByStoreInput,
  GetBillByStoreOutput,
} from './dtos/get-bill-by-store.dto';

export class BillService {
  private readonly billRepository: Repository<Bill>;
  private readonly orderProductRepository: Repository<OrderProduct>;
  private readonly storeRepository: Repository<Store>;

  constructor() {
    this.billRepository = AppDataSource.getRepository(Bill);
    this.orderProductRepository = AppDataSource.getRepository(OrderProduct);
    this.storeRepository = AppDataSource.getRepository(Store);
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

      if (storeId) {
        const store = await this.storeRepository.findOne({
          where: { id: storeId, businessId },
        });

        if (!store) {
          return { ok: false, error: '존재하지 않는 스토어입니다.' };
        }
      }

      //insert bill
      const bill = new Bill();
      if (storeId) {
        bill.storeId = storeId;
      }
      bill.transactionDate = transactionDate;
      bill.memo = memo;
      bill.businessId = businessId;

      await this.billRepository.save(bill);

      const orderProducts = [];
      for (const { count, productId, orderPrice } of orderProductInputs) {
        const orderProduct = new OrderProduct();
        orderProduct.count = count;
        orderProduct.productId = productId;
        orderProduct.billId = bill.id;
        orderProduct.orderPrice = orderPrice;
        orderProduct.businessId = businessId;
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

  async getBill({
    id,
    token,
    businessId,
  }: GetBillInput): Promise<GetBillOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const bill: BillResult = await this.billRepository.findOne({
        where: { id, businessId },
        relations: {
          store: true,
          business: true,
        },
      });

      if (!bill) {
        return { ok: false, error: '존재하지 않는 계산서입니다.' };
      }

      const orderProducts = await this.orderProductRepository.find({
        where: { billId: id },
        relations: {
          product: true,
        },
      });

      bill.orderProducts = orderProducts;

      return { ok: true, bill };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteBill({
    id,
    token,
    businessId,
  }: DeleteBillInput): Promise<DeleteBillOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const bill = await this.billRepository.findOne({
        where: { id, businessId },
      });

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
    token,
    businessId,
    ...updateBillInput
  }: UpdateBillInput): Promise<UpdateBillOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const bill = await this.billRepository.findOne({
        where: { id, businessId },
      });

      if (!bill) {
        return { ok: false, error: '없는 게산서입니다.' };
      }

      if (updateBillInput.storeId) {
        const store = await this.storeRepository.findOne({
          where: { id: updateBillInput.storeId, businessId },
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
          orderProduct = {
            ...orderProduct,
            ...orderProductInput,
            billId: bill.id,
            businessId,
          };
          orderProducts.push(orderProduct);
        }
        await this.orderProductRepository
          .createQueryBuilder()
          .insert()
          .into(OrderProduct)
          .values(orderProducts)
          .execute();
      }

      await this.billRepository.update(
        { id },
        { ...updateBillInput, businessId }
      );

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  //수정
  async getBillByStore({
    storeId,
    page,
    token,
    businessId,
  }: GetBillByStoreInput): Promise<GetBillByStoreOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const store = await this.storeRepository.findOne({
        where: { id: storeId, businessId },
      });
      if (!store) {
        return { ok: false, error: '없는 스토어입니다.' };
      }

      const bills = await this.billRepository
        .createQueryBuilder()
        .select()
        .where('storeId=:storeId', { storeId: store.id })
        .orderBy(`${Bill.name}.id`)
        .offset(page)
        .limit(10)
        .getMany();

      return { ok: true, bills };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  //수정
  async getBills({
    token,
    businessId,
    page,
  }: GetBillsInput): Promise<GetBillsOutput> {
    try {
      await authService.checkBusinessAuth(token, businessId);

      const bills = await this.billRepository
        .createQueryBuilder(Bill.name)
        .leftJoinAndSelect(`${Bill.name}.store`, Store.name)
        .leftJoinAndSelect(`${Bill.name}.business`, Business.name)
        .where(`${Bill.name}.businessId=:businessId`, { businessId })
        .orderBy(`${Bill.name}.id`)
        .offset(page)
        .limit(10)
        .getMany();

      console.log(bills);

      return { ok: true, bills };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
