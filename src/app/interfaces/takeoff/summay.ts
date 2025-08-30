export interface CreateTakeoffSummaryRequest {
  name: string;
  scope: number;
  createdBy: number;
  url: string;
}

export interface TakeoffSummaryResponse {
  message: string;
  statusCode: number;
  data: any; // Define more specific type based on your data structure
}
