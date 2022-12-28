import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AppDataSource } from './../main';
import { CreateUserOutput, CreateUserInput } from './dtos/create-user.dto';

export class UserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(
    createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(createUserInput)
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
