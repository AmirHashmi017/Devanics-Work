import React from "react";
import { Box, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import FormControl from "components/FormControl";

const DateFilters = ({ startDate, setStartDate, endDate, setEndDate }) => {

  const initalValues = {
    from: null,
    to: null
  };

  return (
    <Box display='flex' justifyContent='flex-end'>
      <Box>
        <Formik initialValues={initalValues}>
          {
            () => {
              return <Form>
                <Box display='flex' gap={1} alignItems='center'>
                  <Box width={1} maxWidth={160}>
                    <FormControl onChange={(value) => setStartDate(value)} control='date' name='from' placeholder="From" />
                  </Box>
                  <Typography value={startDate} color="#98A2B3">-</Typography>
                  <Box width={1} maxWidth={160}>
                    <FormControl value={endDate} onChange={(value) => setEndDate(value)} control='date' name='to' placeholder="To" />
                  </Box>
                </Box>
              </Form>
            }
          }

        </Formik>
      </Box>
    </Box>
  );
};

export default DateFilters;
