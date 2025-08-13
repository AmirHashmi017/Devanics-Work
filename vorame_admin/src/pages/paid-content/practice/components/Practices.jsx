import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SinglePractice from "./SinglePractice";
import NoData from "components/NoData";
import Loader from "components/Loader";
import Error from "components/Error";
import PracticeApi from "services/api/practice";
import { useQuery } from "react-query";

const Practices = ({ searchTerm, setRefetch }) => {
    const {
        data: practices = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery("PRACTICE_LIST", () => PracticeApi.getPractices());

    // Expose refetch to parent
    useEffect(() => {
        if (setRefetch) setRefetch(refetch);
    }, [setRefetch, refetch]);

    // Handler to refetch after add/delete/update
    const handleAction = () => refetch();

    if (isLoading) return <Loader />;
    if (isError) return <Error error={error?.message || error} />;

    // Simple frontend search filter
    const filteredPractices = practices.filter(practice =>
        practice.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {filteredPractices && filteredPractices.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={2}>
                    {filteredPractices.map((practiceData) => (
                        <Box
                            key={practiceData._id}
                            flexBasis={{ xs: "100%", sm: "48%", md: "24%" }}
                            maxWidth="320px"
                        >
                            <SinglePractice practiceData={practiceData} onAction={handleAction} />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="subtitle1">Currently concepts not exists.</Typography>
            )}
        </>
    );
};

export default Practices;
