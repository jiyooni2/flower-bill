import { Bill } from './../entities/bill.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface CreateBillInput extends Pick<Bill, 'memo'> {
  storeId?: number;
}

export interface CreateBillOutput extends CoreOutput {}
