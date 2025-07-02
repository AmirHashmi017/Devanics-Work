import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import SingleApplicant from "./SingleApplicant";
import useApiQuery from "hooks/useApiQuery";
import { CAREER_APPLICANTS_KEY, CAREER_APPLICANTS } from "services/constants";
import NoData from "components/NoData";
import Loader from "components/Loader";
import Error from "components/Error";
import { useParams } from "react-router-dom";

const Applicants = () => {
  const { id } = useParams();
  const {
    isLoading,
    error,
    data: apiResponse,
  } = useApiQuery({
    queryKey: [CAREER_APPLICANTS_KEY],
    url: CAREER_APPLICANTS + id,
  });

  if (isLoading) return <Loader />;
  if (error) return <Error error={error} />;

  const applicantsCount = apiResponse ? apiResponse.data.applicants.length : 0;

  return (
    <Box
      borderRadius="10px"
      bgcolor="white"
      border="1px solid #EAECEE"
      p={3}
      mt={3}
    >
      <Typography variant="body1" fontWeight={600} fontSize={24}>
        {applicantsCount > 0 ? applicantsCount : null} Applicants
      </Typography>
      {apiResponse && (
        <Box>
          {apiResponse.data.applicants.length > 0 ? (
            <Stack gap={1.5} mt={4}>
              {apiResponse.data.applicants.map((applicant, { _id }) => (
                <SingleApplicant key={_id} {...applicant} />
              ))}
            </Stack>
          ) : (
            <NoData />
          )}
        </Box>
      )}
    </Box>
  );
};

export default Applicants;
