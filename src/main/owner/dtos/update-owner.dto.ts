import { CoreOutput } from '../../common/dtos/core.dto';
import { Owner } from '../entities/owner.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface UpdateOwnerInput
  extends Partial<Pick<Owner, 'password' | 'nickname'>>,
    AuthInput {
  id: number;
}

export interface UpdateOwnerOutput extends CoreOutput {}
