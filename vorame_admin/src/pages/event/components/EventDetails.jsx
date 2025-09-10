import React from "react";
import { Box, Typography } from "@mui/material";
import Reservations from "./Reservations";
import { EVENT } from "../../../services/constants";
import Loader from "components/Loader";
import Error from "components/Error";
import { useParams } from "react-router-dom";
import useApiQuery from "hooks/useApiQuery";
import moment from "moment";
import { CustomButton } from "components";

const EventDetails = () => {
  const { id } = useParams();
  const {
    isLoading,
    error,
    data: apiResponse,
  } = useApiQuery({ queryKey: [EVENT, id], url: EVENT + `/${id}` });

  if (isLoading) return <Loader />;
  if (error) return <Error error={error} />;

  const { eventName, date, time, description} = apiResponse.data;

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography variant="body1" fontWeight={600} fontSize={24}>
          Event Details
        </Typography>
        
      </Box>
      <Box
        borderRadius="10px"
        bgcolor="white"
        border="1px solid #EAECEE"
        boxShadow="none"
        p={3}
        mt={3}
      >
        <Box display="flex" gap="6px" alignItems="center">
          <Typography
            variant="body2"
            color="#222222"
            fontSize="18px"
            fontWeight={500}
          >
            {eventName}
          </Typography>
        </Box>
        <Box display="flex" mt="6px" gap="5px" alignItems="center">
          <Typography
            variant="body2"
            color="#222222"
            fontSize="12px"
            fontWeight={600}
          >
            Date:
          </Typography>
          <Typography
            variant="body2"
            color="#222222"
            fontSize="12px"
            fontWeight={400}
          >
            {moment(date).format("DD-MM-YYYY")}
          </Typography>
        </Box>

        <Box display="flex" gap="5px" alignItems="center">
          <Typography
            variant="body2"
            color="#222222"
            fontSize="12px"
            fontWeight={600}
          >
            Time:
          </Typography>
          <Typography
            variant="body2"
            color="#222222"
            fontSize="12px"
            fontWeight={400}
          >
            {time}
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body1" fontSize="12px" color="#858688">
            About Event
          </Typography>
          <Typography mt={1} variant="body1" fontSize="14px" color="#858688">
            {description}
          </Typography>
        </Box>
      </Box>
      <Reservations />
    </div>
  );
};

export default EventDetails;
