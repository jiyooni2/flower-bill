import { CoreOutput } from 'main/common/dtos/core.dto';
import { Business } from './../entities/business.entity';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface CreateBusinessInput
  extends Pick<
      Business,
      | 'name'
      | 'businessNumber'
      | 'businessOwnerName'
      | 'address'
      | 'typeofBusiness'
      | 'sector'
    >,
    AuthInput {}

export interface CreateBusinessOutput extends CoreOutput {}
