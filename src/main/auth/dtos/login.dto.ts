import { Owner } from '../../owner/entities/owner.entity';
import { CoreOutput } from '../../common/dtos/core.dto';

export interface LoginInput extends Pick<Owner, 'password' | 'ownerId'> {}

export interface LoginOutput extends CoreOutput {
  token?: string;
}
