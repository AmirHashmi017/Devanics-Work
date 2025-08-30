import { IResponseInterface } from '../interfaces/api-response.interface';
import {
  IEstimateProposal,
  IEstimateProposalForm,
} from '../interfaces/estimate-proposal.interface';
import { HttpService } from './base.service';

class EstimateProposalService extends HttpService {
  private readonly prefix: string = 'api/estimate/proposal';

  httpCreateProposal = (
    data: IEstimateProposalForm
  ): Promise<IResponseInterface<IEstimateProposal>> =>
    this.post(`${this.prefix}/create`, data);

  httpUpdateProposal = (
    id: string,
    data: IEstimateProposalForm
  ): Promise<IResponseInterface<IEstimateProposal>> =>
    this.put(`${this.prefix}/update/${id}`, data);

  httpGetProposalById = (
    id: string
  ): Promise<IResponseInterface<IEstimateProposal>> =>
    this.get(`${this.prefix}/${id}`);

  httpClientSignProposal = (
    id: string,
    data: IEstimateProposalForm['companySignature']
  ): Promise<IResponseInterface<IEstimateProposal>> =>
    this.post(`${this.prefix}/client-sign/${id}`, data);

  httpGetAllProposals = (): Promise<IResponseInterface<IEstimateProposal[]>> =>
    this.get(`${this.prefix}/all`);

  httpDeleteProposal = (
    id: string
  ): Promise<IResponseInterface<IEstimateProposal>> =>
    this.delete(`${this.prefix}/${id}`);

  httpUpdateProposalStatus = (
    id: string,
    data: Pick<IEstimateProposal, 'status' | 'reason' | 'reasonMessage'>
  ): Promise<IResponseInterface<IEstimateProposal>> =>
    this.post(`${this.prefix}/status/${id}`, data);
}

export default new EstimateProposalService();
