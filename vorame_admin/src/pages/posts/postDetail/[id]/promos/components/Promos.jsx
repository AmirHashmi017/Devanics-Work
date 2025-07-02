import React from "react";
import { Grid } from "@mui/material";
import NoData from "components/NoData";
import useApiQuery from "hooks/useApiQuery";
import { PROMO } from "services/constants";
import SinglePromo from "./SinglePromo";
import Loader from "components/Loader";
import Error from "components/Error";

const Promos = ({ searchTerm }) => {
    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({ queryKey: ["promos", searchTerm], url: PROMO + `list?searchTerm=${searchTerm}` });

    if (isLoading) return <Loader />;
    if (error) return <Error error={error} />

    return (
        <Grid container spacing={2} mt={3}>
            {apiResponse &&
                (apiResponse.data.length > 0 ? (
                    apiResponse.data.map((promoData) => (
                        <Grid width={1} key={promoData._id} item sm={6}>
                            <SinglePromo {...promoData} />
                        </Grid>
                    ))
                ) : (
                    <NoData />
                ))}
        </Grid>
    );
};

export default Promos;
