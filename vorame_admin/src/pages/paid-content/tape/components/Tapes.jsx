import React from "react";
import { Box, Grid } from "@mui/material";
import SingleTape from "../components/SingleTape";
import { TAPE } from "services/constants";
import useApiQuery from "hooks/useApiQuery";
import NoData from "components/NoData";
import Loader from "components/Loader";
import Error from "components/Error";

const Tapes = ({ searchTerm }) => {

    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({ queryKey: ["tapes", searchTerm], url: TAPE + `list?searchTerm=${searchTerm}` });
    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    return <Box mt={6}>
        <Grid container spacing={2} mt={3}>
            {apiResponse &&
                (apiResponse.data.tapes.length > 0 ? (
                    apiResponse.data.tapes.map((tapeData) => (
                        <Grid width={1} key={tapeData._id} item sm={6} md={6} lg={4}>
                            <SingleTape {...tapeData} />
                        </Grid>
                    ))
                ) : (
                    <NoData />
                ))}
        </Grid>
    </Box>
};

export default Tapes;
