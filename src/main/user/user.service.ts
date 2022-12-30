import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AppDataSource } from './../main';
import { CreateUserOutput, CreateUserInput } from './dtos/create-user.dto';
import { UpdateUserInput, UpdateUserOutput } from './dtos/update-user.dto';

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

  async updateUser({
    id,
    ...updateUserInput
  }: UpdateUserInput): Promise<UpdateUserOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return { ok: false, error: '없는 유저입니다.' };
      }

      await this.userRepository.update({ id }, { ...updateUserInput });

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
