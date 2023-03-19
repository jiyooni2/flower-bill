import { Business } from './../entities/business.entity';
import { AuthInput } from './../../common/dtos/auth.dto';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface GetBusinessInput extends AuthInput {
  id: number;
}

export interface GetBusinessOutput extends CoreOutput {
  business?: Business;
}
