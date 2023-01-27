import { CoreOutput } from '../../common/dtos/core.dto';
import { Owner } from '../entities/owner.entity';

export interface CreateOwnerInput extends Pick<Owner, 'name' | 'password'> {}

export interface CreateOwnerOutput extends CoreOutput {}
