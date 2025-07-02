import React from "react";
import { Box, Grid } from "@mui/material";
import NoData from "components/NoData";
import useApiQuery from "hooks/useApiQuery";
import SingleEvent from "./SingleEvent";
import { EVENT_KEY, EVENT_LIST } from "services/constants";
import Loader from "components/Loader";
import Error from "components/Error";

const EventList = () => {
    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({ queryKey: [EVENT_KEY], url: EVENT_LIST });

    if (isLoading) return <Loader />
    if (error) return <Error error={error} />
    return (
        <Box mt={3}>
            {apiResponse &&
                (apiResponse.data.events.length > 0 ? (
                    <Grid container spacing={2.5}>
                        {
                            apiResponse.data.events.map((event, i) => (
                                <Grid sm={6} md={4} lg={4} item>
                                    <SingleEvent key={i} {...event} />
                                </Grid>
                            ))
                        }
                    </Grid>
                ) : (
                    <NoData />
                ))}
        </Box>
    );
};

export default EventList;
