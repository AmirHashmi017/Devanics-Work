// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IToken } from '@/app/interfaces/authInterfaces/token.interface';
import { IEstimateRequest } from '@/app/interfaces/estimateRequests/estimateRequests.interface';
import { IGeneratedEstimate } from '../interfaces/estimate.interface';
import { FileInterface } from '../interfaces/file.interface';

class EstimateRequestsService extends HttpService {
  private readonly prefix: string = 'api/estimate';

  httpAddNewEstimateRequest = (
    data: IEstimateRequest
  ): Promise<IResponseInterface<{ token: IToken }>> =>
    this.post(`${this.prefix}/addNewEstimateRequest`, data);

  httpGetAllEstimateRequests = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getAllEstimateRequests?page=${page}&limit=${limit}`
    );

  httpGetEstimateDetail = (id: string | null): Promise<IResponseInterface> =>
    this.get(`${this.prefix}//estimateDetail/${id}`);

  httpUpdateEstimateRequest = (
    data: IEstimateRequest,
    estimateId: string | string[]
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/updateEstimateRequest/${estimateId}`, data);

  httpDeleteEstimateRequest = (
    estimateId: string
  ): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/deleteEstimateRequest/${estimateId}`);

  httpAddGeneratedEstimate = (
    data: any
  ): Promise<IResponseInterface<{ token: IToken; _id?: string }>> =>
    this.post(`${this.prefix}/addNewGenerateEstimate`, data);
  httpUpdateGeneratedEstimate = (
    data: any,
    generatedEstimateId: string | null
  ): Promise<IResponseInterface<{ token: IToken; _id?: string }>> =>
    this.post(
      `${this.prefix}/updateGeneratedEstimateDetail/${generatedEstimateId}`,
      data
    );

  httpGetAllGeneratedEstimates = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getGeneratedEstimates?page=${page}&limit=${limit}`
    );

  httpGetAllGeneratedEstimatesWithoutLimit = (): Promise<
    IResponseInterface<{ generatedEstimates: IEstimateRequest[] }>
  > => this.get(`${this.prefix}/getGeneratedEstimates`);

  httpDeleteGeneratedEstimate = (
    estimateId: string
  ): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/deleteGeneratedEstimate/${estimateId}`);
  httpChangeGeneratedEstimateStatus = (
    estimateId: string,
    data: { status: string; reason: string }
  ): Promise<IResponseInterface> =>
    this.post(
      `${this.prefix}/changeGeneratedEstimateStatus/${estimateId}`,
      data
    );

  httpGetGeneratedEstimateDetail = (
    estimateId: string | string[] | null
  ): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/getGeneratedEstimateDetail/${estimateId}`);

  httpGetGeneratedEstimateDetailById = (
    estimateId: string
  ): Promise<IResponseInterface<IGeneratedEstimate>> =>
    this.get(`${this.prefix}/generated-estimate-detail/${estimateId}`);

  httpEstimateRequestStatusChangeHandler = (
    estimateId: string,
    bodyObject: any
  ): Promise<IResponseInterface<{ estimateRequestData: IEstimateRequest }>> =>
    this.put(`${this.prefix}/changeEstimateStatus/${estimateId}`, {
      status: bodyObject.status,
    });

  deleteGeneratedEstimateItem = (
    generatedEstimateId: string | null,
    estiamteScopeId: string | null,
    estimateItemId: string | undefined
  ): Promise<IResponseInterface> =>
    this.delete(
      `${this.prefix}/deleteGeneratedEstimateItems/${generatedEstimateId}/${estiamteScopeId}/${estimateItemId}`,
      {}
    );

  httpEstimateEmailSender = (data: any): Promise<any> =>
    this.post(`${this.prefix}/sendEmail`, data);

  httpCompanySignTheEstimate = (
    id: string,
    data: { file: FileInterface; pdf: FileInterface }
  ): Promise<IResponseInterface<IGeneratedEstimate>> =>
    this.post(`${this.prefix}/company-sign/${id}`, data);

  httpClientSignTheEstimate = (
    id: string,
    data: {
      file: FileInterface;
      name: string;
      isApproved: boolean;
      pdf: FileInterface;
    }
  ): Promise<IResponseInterface<IGeneratedEstimate>> =>
    this.post(`${this.prefix}/client-sign/${id}`, data);
}
export const estimateRequestService = new EstimateRequestsService();
