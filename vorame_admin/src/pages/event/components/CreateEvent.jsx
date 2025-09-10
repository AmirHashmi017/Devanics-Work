import React from "react";
import dayjs from "dayjs";
import { CustomButton } from "components";
import { Box } from "@mui/material";
import { CREATE_EVENT, EVENT, EVENT_KEY } from "services/constants";
import * as yup from "yup";
import { Form, Formik } from "formik";
import useApiMutation from "hooks/useApiMutation";
import FormControl from "components/FormControl";
import useInvalidateQuery from "hooks/useInvalidateQuery";

const CreateEvent = ({ setOpen, eventData = null }) => {
  const invalidateEvents = useInvalidateQuery();

  const {
    eventName = "",
    date = null,
    time = null,
    duration= null,
    description = "",
  } = eventData || {};

  const { mutate, isLoading } = useApiMutation({});

  const initalValues = {
    eventName,
    date,
    time,
    duration,
    description,
  };

  const validationSchema = yup.object().shape({
    eventName: yup.string().required("Event Name is required"),
    date: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
    duration: yup.string().required("Duration is required"),
    description: yup.string().required("Description is required"),
  });

  const handleSubmit = (values) => {
    const dateOnly = dayjs(values.date).format("YYYY-MM-DD");

    mutate(
      {
        method: eventData ? "patch" : "post",
        url: eventData ? EVENT + `/${eventData._id}` : CREATE_EVENT,
        data: { ...values, date: dateOnly },
      },
      {
        onSuccess: () => {
          setOpen(false);
          invalidateEvents([EVENT_KEY]);
        },
      }
    );
  };

  return (
    <Formik
      initialValues={initalValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => {
        return (
          <Form>
            <Box display="flex" flexDirection="column" gap="12px">
              <FormControl
                control="input"
                label="Event Name"
                name="eventName"
                placeholder="Enter name"
              />
              <FormControl
                control="date"
                label="Date"
                name="date"
                placeholder="dd/mm/yyyy"
              />
              <FormControl
                control="time"
                label="Time"
                name="time"
                placeholder="Select Time"
              />
              <FormControl
                control="select"
                label="Duration"
                name="duration"
                placeholder="Select Duration"
                options={[
                  { label: "15 minutes", value: 15 },
                  { label: "30 minutes", value: 30 },
                  { label: "45 minutes", value: 45 },
                ]}
              />
              <FormControl
                control="textarea"
                label="About Event"
                name="description"
                placeholder="About Event..."
              />
              <Box display="flex" justifyContent="space-between" mt={1.5}>
                <CustomButton onClick={() => setOpen(false)}>
                  Cancel
                </CustomButton>
                <CustomButton type="submit">
                  {eventData ? "Update Event" : "Create Event"} {isLoading && "..."}
                </CustomButton>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateEvent;
