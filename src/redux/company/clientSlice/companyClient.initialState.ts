import { IClient } from '@/app/interfaces/companyInterfaces/companyClient.interface';

interface IClients {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: IClient[];
  generatedEstimatesData: any;
}

const initialCompanyClientState: IClients = {
  loading: false,
  error: null,
  message: null,
  data: [],
  statusCode: null,
  generatedEstimatesData: null,
};

export default initialCompanyClientState;
