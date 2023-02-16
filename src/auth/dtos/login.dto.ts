import { Owner } from '../../main/owner/entities/owner.entity';
import { CoreOutput } from '../../main/common/dtos/core.dto';

export interface LoginInput extends Pick<Owner, 'password' | 'ownerId'> {}

export interface LoginOutput extends CoreOutput {
  token?: string;
}
