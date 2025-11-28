import { UseQueryOptions } from 'react-query';
import { apiRequestFn } from 'src/utils/axios';

const { useQuery } = require('react-query');

type UseApiQueryParams = {
  queryKey: string[];
  url: string;
  data?: any;
  apiOptions?: any;
  otherOptions?: UseQueryOptions;
};

const useApiQuery = ({
  queryKey = [],
  url,
  data,
  apiOptions = {},
  otherOptions = {
    refetchOnWindowFocus: false,
  },
}: UseApiQueryParams) => {
  return useQuery(
    queryKey,
    () => apiRequestFn({ url, ...(data && { data }), ...apiOptions }),
    otherOptions
  );
};

export default useApiQuery;
