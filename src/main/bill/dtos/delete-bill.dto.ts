import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';
import { AuthInput } from './../../common/dtos/auth.dto';

export interface DeleteBillInput extends Pick<Bill, 'id'>, AuthInput {}

export interface DeleteBillOutput extends CoreOutput {}
