import { CoreOutput } from 'main/common/dtos/core.dto';
import { Owner } from '../../owner/entities/owner.entity';

export interface ChangePasswordInput
  extends Pick<Owner, 'ownerId' | 'findPasswordCode'> {
  newPassword: string;
}

export interface ChangePasswordOutput extends CoreOutput {}
