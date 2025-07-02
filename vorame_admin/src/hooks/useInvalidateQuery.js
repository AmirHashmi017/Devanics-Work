import { useQueryClient } from "react-query";

const useInvalidateQuery = () => {
    const queryClient = useQueryClient();

    const invalidateQuery = (queryKey = []) => {
        if (queryKey.length < 1) {
            return;
        }
        queryClient.invalidateQueries({ queryKey });
    };

    return invalidateQuery;
};

export default useInvalidateQuery;
