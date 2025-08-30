// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IToken } from '@/app/interfaces/authInterfaces/token.interface';
import { ISettingTarget } from '@/app/interfaces/companyInterfaces/setting.interface';

class SettingTargetService extends HttpService {
  private readonly prefix: string = 'api/setting/target';

  httpAddNewSettingTarget = (
    data: Omit<ISettingTarget, 'year'>
  ): Promise<IResponseInterface<{ token: IToken }>> =>
    this.post(`${this.prefix}/addNewSettingTarget`, data);

  httpGetAllSettingTargets = (
    page: number,
    limit: number = 9,
    year: string | undefined = undefined
  ): Promise<IResponseInterface<ISettingTarget[]>> =>
    this.get(
      `${this.prefix}/getAllSettingTargets?page=${page}&limit=${limit}&year=${year}`
    );

  httpUpdateSettingTarget = (
    data: Omit<ISettingTarget, 'year'>,
    targetId: string | string[]
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/updateSettingTarget/${targetId}`, data);

  httpDeleteSettingTarget = (targetId: string): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/delete/${targetId}`);
}
export const settingTargetService = new SettingTargetService();
