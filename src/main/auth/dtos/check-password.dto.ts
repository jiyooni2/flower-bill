import { AuthInput } from '../../common/dtos/auth.dto';
import { CoreOutput } from '../../common/dtos/core.dto';

export interface CheckPasswordInput extends AuthInput {
  password: string;
}

export interface CheckPasswordOutput extends CoreOutput {}
