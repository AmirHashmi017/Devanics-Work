import React from "react";
import { CustomButton } from "components";
import { Box } from "@mui/material";
import { CAREERS, CREATE_CAREER } from "services/constants";
import * as yup from "yup";
import { Form, Formik } from "formik";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import FormControl from "components/FormControl";

const CreatePromotion = ({ setOpen, careerData = null }) => {
  const queryClient = useQueryClient();
  const fetchCareerList = () =>
    queryClient.invalidateQueries({ queryKey: CAREERS });

  const {
    title = '',
    location = '',
    lastDate = null,
    description = null
  } = careerData || {};

  const { mutate, isLoading } = useApiMutation({});

  const initalValues = {
    title,
    location,
    lastDate,
    description
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    location: yup.string().required("Location is required"),
    lastDate: yup.string().required("Last Date is required"),
    description: yup.string().required("Description is required")
  });

  const handleSubmit = (values) => {
    mutate(
      {
        url: CREATE_CAREER,
        data: values
      }, {
      onSuccess: () => {
        setOpen(false);
        fetchCareerList();
      },
    }
    );
  }

  return (
    <Formik initialValues={initalValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {
        () => {
          return <Form>
            <Box display="flex" flexDirection="column" gap="12px">
              <FormControl control='input' label='Job Title' name='title' placeholder="Enter job title" />
              <FormControl control='input' label='Job Location' name='location' placeholder="Enter job location" />
              <FormControl control='date' label='Last date of submission' name='lastDate' placeholder="dd/mm/yyyy" />
              <FormControl control='textarea' label='Job Description' name='description' placeholder="Enter job description..." />
              <Box display="flex" justifyContent="space-between" mt={1.5}>
                <CustomButton onClick={() => setOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit">
                  {careerData ? "Update Job" : "Add Job"} {isLoading && "..."}
                </CustomButton>
              </Box>
            </Box>
          </Form>
        }
      }

    </Formik>
  );
};

export default CreatePromotion;
