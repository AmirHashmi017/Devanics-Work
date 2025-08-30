import { CrmType } from '@/app/interfaces/crm/crm.interface';

type State = {
  loading: boolean;
  error?: string;
  data: CrmType[];

  clients: CrmType[];
  partners: CrmType[];
  subcontractors: CrmType[];
  vendors: CrmType[];
  architects: CrmType[];
  contractors: CrmType[];

  isUpdatingStatus: boolean;
};

export const crmInitialState: State = {
  loading: false,
  error: undefined,
  data: [],

  architects: [],
  clients: [],
  contractors: [],
  partners: [],
  subcontractors: [],
  vendors: [],

  isUpdatingStatus: false,
};
