import { AuthInput } from './../../common/dtos/auth.dto';
import { Business } from '../entities/business.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface UpdateBusinessInput
  extends Partial<
      Pick<
        Business,
        | 'businessNumber'
        | 'address'
        | 'name'
        | 'businessOwnerName'
        | 'typeofBusiness'
        | 'sector'
      >
    >,
    AuthInput {
  businessId: number;
}

export interface UpdateBusinessOutPut extends CoreOutput {}
