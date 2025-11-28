import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { apiRequestFn } from 'src/utils/axios';

type UseApiMutationParams = {
  method?: 'post' | 'put' | 'delete' | 'get';
  url: string;
  data?: any;
  [key: string]: any;
};

const useApiMutation = (otherOptions = {}) =>
  useMutation({
    mutationFn: ({
      method = 'post',
      url,
      data,
      ...rest
    }: UseApiMutationParams) =>
      apiRequestFn({ method, url, ...(data && { data }), ...rest }),
    onError: ({ response }) => {
      const { data = {} } = response || {};
      toast.error(data?.message || 'Something went wrong');
    },
    ...otherOptions,
  });

export default useApiMutation;
