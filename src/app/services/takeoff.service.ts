// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IToken } from '@/app/interfaces/authInterfaces/token.interface';

interface INewPreset {
  label: string;
  value: string;
}
class TakeoffService extends HttpService {
  private readonly prefix: string = 'api/takeoff';

  httpAddNewPreset = (
    data: INewPreset
  ): Promise<IResponseInterface<{ token: IToken }>> =>
    this.post(`${this.prefix}/addCustomPreset`, data);

  httpGetAllPresets = (): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/getAllCustomPreset`);

  httpDeletePreset = (presetId: string): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/ /preset/delete/:${presetId}`);
}
export const takeoffPresetService = new TakeoffService();
