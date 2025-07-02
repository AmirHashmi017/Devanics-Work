import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import SingleReservation from "./SingleReservation";
import useApiQuery from "hooks/useApiQuery";
import { EVENT_KEY, EVENT_RESERVATIONS } from "services/constants";
import NoData from "components/NoData";
import Loader from "components/Loader";
import Error from "components/Error";
import { useParams } from "react-router-dom";

const Reservations = () => {
  const { id } = useParams();
  const {
    isLoading,
    error,
    data: apiResponse,
  } = useApiQuery({
    queryKey: [EVENT_RESERVATIONS, id],
    url: EVENT_RESERVATIONS + id,
    otherOptions: {
      enabled: id ? true : false,
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <Error error={error} />;

  const reservationCount = apiResponse
    ? apiResponse.data.reservations.length
    : 0;

  return (
    <Box
      borderRadius="10px"
      bgcolor="white"
      border="1px solid #EAECEE"
      p={3}
      mt={3}
    >
      <Typography variant="body1" fontWeight={600} fontSize={24}>
        {reservationCount > 0 ? reservationCount : null} Reservations
      </Typography>
      {apiResponse && (
        <Box>
          {apiResponse.data.reservations.length > 0 ? (
            <Grid container gap={1.5} mt={4}>
              {apiResponse.data.reservations.map((reservation, { _id }) => (
                <Grid item sm={6}>
                  <SingleReservation key={_id} {...reservation} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NoData />
          )}
        </Box>
      )}
    </Box>
  );
};

export default Reservations;
