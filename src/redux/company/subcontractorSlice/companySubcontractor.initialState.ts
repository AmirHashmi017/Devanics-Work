import { ISubcontractor } from '@/app/interfaces/companyInterfaces/subcontractor.interface';

interface ISubcontractorState {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: null | ISubcontractor[];
}

const initialCompanySubcontractorState: ISubcontractorState = {
  loading: false,
  error: null,
  message: null,
  data: null,
  statusCode: null,
};

export default initialCompanySubcontractorState;
