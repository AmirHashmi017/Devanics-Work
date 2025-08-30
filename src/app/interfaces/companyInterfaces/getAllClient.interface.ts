import { IPaginationInfo } from '@/app/interfaces/paginationinfo.interface';

export interface IGetClients<T = any> {
  data: T[];
  paginationInfo: IPaginationInfo;
}
