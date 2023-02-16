import { CoreOutput } from '../../common/dtos/core.dto';
import { Owner } from '../entities/owner.entity';

export interface CreateOwnerInput
  extends Pick<Owner, 'nickname' | 'password' | 'ownerId'> {}

export interface CreateOwnerOutput extends CoreOutput {}
