import { CoreOutput } from 'main/common/dtos/core.dto';
import { Business } from './../entities/business.entity';

export interface CreateBusinessInput
  extends Pick<
    Business,
    'name' | 'businessNumber' | 'businessOwnerName' | 'address' | 'ownerId'
  > {}

export interface CreateBusinessOutput extends CoreOutput {}
