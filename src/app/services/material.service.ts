// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IToken } from '@/app/interfaces/authInterfaces/token.interface';
import { IUnits } from '../interfaces/settings/material-settings.interface';

class MaterialService extends HttpService {
  private readonly prefix: string = 'api/setting/material';

  httpUploadMaterialsData = (
    data: FormData
  ): Promise<IResponseInterface<{ token: IToken }>> =>
    this.post(`${this.prefix}/upload-materials`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  httpGetMeterialWithCategoryId = (
    categoryId: string,
    subCategoryId: string
  ): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getMetarialwithCategory/${categoryId}?subCategoryId=${subCategoryId}`
    );

  httpFetchMaterialUnits = (): Promise<
    IResponseInterface<{ fetchedUnits: IUnits[] }>
  > => this.get(`${this.prefix}/fetchMaterialUnits`);

  httpGetAllMaterialsData = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/get-all-materials?page=${page}&limit=${limit}`);

  httpUpdateMaterial = (
    materialId: string,
    data: any
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/update-material/${materialId}`, data);

  httpDeleteMaterial = (materialId: string): Promise<IResponseInterface> =>
    this.delete(`${this.prefix}/delete/${materialId}`);
}
export const materialService = new MaterialService();
