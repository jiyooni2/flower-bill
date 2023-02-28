import { Business } from './../entities/business.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface GetBusinessesInput extends AuthInput {}

export interface GetBusinessesOutput extends CoreOutput {
  businesses?: Business[];
}
