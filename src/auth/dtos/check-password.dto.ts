import { AuthInput } from './../../main/common/dtos/auth.dto';
import { CoreOutput } from './../../main/common/dtos/core.dto';

export interface CheckPasswordInput extends AuthInput {
  password: string;
}

export interface CheckPasswordOutput extends CoreOutput {}
