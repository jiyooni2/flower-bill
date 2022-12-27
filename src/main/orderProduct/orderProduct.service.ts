import { Repository } from 'typeorm';
import { OrderProduct } from './entities/orderProduct.entity';
import { AppDataSource } from './../main';

export class OrderProductService {
  private readonly orderProductRepository: Repository<OrderProduct>;

  constructor() {
    this.orderProductRepository = AppDataSource.getRepository(OrderProduct);
  }
}
