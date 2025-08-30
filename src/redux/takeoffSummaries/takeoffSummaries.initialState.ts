interface ITakeoffSummaries {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: any;
}

const initialTakeoffSummariesState: ITakeoffSummaries = {
  loading: false,
  error: null,
  message: null,
  data: null,
  statusCode: null,
};

export default initialTakeoffSummariesState;
