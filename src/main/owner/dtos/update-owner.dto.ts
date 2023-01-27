import { CoreOutput } from '../../common/dtos/core.dto';
import { Owner } from '../entities/owner.entity';

export interface UpdateOwnerInput
  extends Partial<Pick<Owner, 'name' | 'password'>> {
  id: number;
}

export interface UpdateOwnerOutput extends CoreOutput {}
