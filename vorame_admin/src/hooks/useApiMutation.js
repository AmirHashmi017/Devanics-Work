import { useMutation } from "react-query";
import { apiRequestFn } from "../utils";
import { toast } from "react-toastify";

const useApiMutation = (otherOptions = {}) =>
  useMutation({
    mutationFn: ({ method = "post", url, data, ...rest }) =>
      apiRequestFn({ method, url, ...(data && { data }), ...rest }),
    onError: ({ response }) => {
      const { data = {} } = response || {}
      toast.error(data?.message || 'Something went wrong')
    },
    ...otherOptions,
  });

export default useApiMutation;
