interface IEstimateRequests {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: any;
  generateEstimateDetail: {
    estimateRequestIdDetail: Object;
    estimateScope: Object[];
    totalBidDetail?: object;
    totalCost?: number;
  };
}

const initialEstimateRequestState: IEstimateRequests = {
  loading: false,
  error: null,
  message: null,
  data: [],
  statusCode: null,
  generateEstimateDetail: {
    estimateRequestIdDetail: {},
    estimateScope: [],
    totalBidDetail: {},
    totalCost: 0,
  },
};

export default initialEstimateRequestState;
