import { CoreOutput } from './../../common/dtos/core.dto';
import { User } from './../entities/user.entity';

export interface CreateUserInput
  extends Pick<User, 'businessNumber' | 'name' | 'owner' | 'address'> {}

export interface CreateUserOutput extends CoreOutput {}
