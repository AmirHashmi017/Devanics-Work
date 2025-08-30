import { IResponseInterface } from '../interfaces/api-response.interface';
import { IProposal } from '../interfaces/proposal.interface';
import { HttpService } from './base.service';

type CreateSubmitBidForm = {
  bidTrades: string[];
  projectId: string;
  price: number;
  projectDuration: number;
  projectDurationType: string;
  additionalDetails: string;
  priceExpiryDuration: number;
  increaseInPercentage: number;
  file: {
    url: string;
    type: string;
    extension: string;
    name: string;
  };
  projectScopes: {
    description: string;
    quantity: number;
    price: number;
  }[];
};

class ProposalService extends HttpService {
  private endPoint = 'api/proposal';

  httpSubmitProposal = (
    data: CreateSubmitBidForm
  ): Promise<
    IResponseInterface<{
      submittedProposal: IProposal;
    }>
  > => {
    return this.post(`${this.endPoint}/submit`, data);
  };
  httpGetProposalDetailsByProjectId = (
    projectId: string
  ): Promise<IResponseInterface<{ proposalDetails: IProposal }>> => {
    return this.get(`${this.endPoint}/bid-details/${projectId}`);
  };
}

export const proposalService = new ProposalService();
