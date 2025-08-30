interface IPartner {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: any;
  generatedEstimatesData: any;
}

const initialCompanyPartnerState: IPartner = {
  loading: false,
  error: null,
  message: null,
  data: null,
  statusCode: null,
  generatedEstimatesData: null,
};

export default initialCompanyPartnerState;
