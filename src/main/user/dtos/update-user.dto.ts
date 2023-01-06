import { User } from '../entities/user.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface UpdateUserInput
  extends Partial<
    Pick<User, 'address' | 'businessNumber' | 'owner' | 'password'>
  > {
  id: number;
}

export interface UpdateUserOutput extends CoreOutput {}
