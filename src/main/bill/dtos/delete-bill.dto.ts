import { Bill } from '../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface DeleteBillInput extends Pick<Bill, 'id'> {}

export interface DeleteBillOutput extends CoreOutput {}
