import React, { useEffect } from "react";
import { Box } from "@mui/material";
import SinglePractice from "./SinglePractice";
import NoData from "components/NoData";
import Loader from "components/Loader";
import Error from "components/Error";
import PracticeApi from "services/api/practice";
import { useQuery } from "react-query";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 370; // Adjust as needed for your content
const CARD_GAP = 24;

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
        <Box display="flex" flexWrap="wrap" gap={`${CARD_GAP}px`}>
            {filteredPractices.length > 0 ? (
                filteredPractices.map((practiceData) => (
                    <Box
                        key={practiceData._id}
                        width={`${CARD_WIDTH}px`}
                        minHeight={`${CARD_HEIGHT}px`}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        <SinglePractice practiceData={practiceData} onAction={handleAction} />
                    </Box>
                ))
            ) : (
                <NoData />
            )}
        </Box>
    );
};

export default Practices;
