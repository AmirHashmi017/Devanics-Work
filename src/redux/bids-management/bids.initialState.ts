import { IBidManagement } from '@/app/interfaces/bids.interface';

export interface IBidState {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: IBidManagement[] | any;
}

const initialBidsState: IBidState = {
  loading: false,
  error: null,
  message: null,
  data: [],
  statusCode: null,
};

export default initialBidsState;
