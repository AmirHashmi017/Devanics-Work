export interface IEstimateRequest {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  projectName: string;
  status?: string;
  leadSource: string;
  projectValue: string;
  projectInformation: string;
  salePerson: string;
  estimator: string;
  otherDocuments?: Object[];
  takeOffReports?: Object[];
  drawingsDocuments?: Object[];
}
