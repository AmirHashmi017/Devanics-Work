import { apiRequestFn } from "../utils/index";

const { useQuery } = require("react-query")
const useApiQuery = ({
  queryKey = "",
  url,
  data,
  apiOptions = {},
  otherOptions = {}
}) => {
  return useQuery(
    queryKey,
    () => apiRequestFn({ url, ...(data && { data }), ...apiOptions }), { ...otherOptions }
  );
}


export default useApiQuery;