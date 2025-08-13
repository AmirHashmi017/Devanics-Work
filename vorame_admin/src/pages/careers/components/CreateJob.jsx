import React from "react";
import { CustomButton } from "components";
import { Box } from "@mui/material";
import { CAREER, CAREERS, CREATE_CAREER,CAREER_LIST } from "services/constants";
import * as yup from "yup";
import { Form, Formik } from "formik";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import FormControl from "components/FormControl";
import { toast } from "react-toastify";

const CreateJob = ({ setOpen, JobData = null }) => {
  const queryClient = useQueryClient();
  const fetchCareerList = () => {
    queryClient.invalidateQueries({ queryKey: [CAREERS] });
    queryClient.invalidateQueries({ queryKey: [CAREER_LIST] });
  };

  const isUpdateMode = !!JobData;

  const {
    title = '',
    location = '',
    lastDate = null,
    description = ''
  } = JobData || {};

  const { mutate, isLoading } = useApiMutation({});

  // Format the date for the date input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const initialValues = {
    title,
    location,
    lastDate: formatDateForInput(lastDate),
    description
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    location: yup.string().required("Location is required"),
    lastDate: yup.string().required("Last Date is required").test(
      'is-valid-date',
      'Please enter a valid date',
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
    ),
    description: yup.string().required("Description is required")
  });

  const handleSubmit = (values) => {
    const url = isUpdateMode ? `${CAREER}/${JobData._id}` : CREATE_CAREER;
    const method = isUpdateMode ? 'patch' : 'post';
    
    // Transform data for API
    const apiData = {
      title: values.title,
      location: values.location,
      lastDate: values.lastDate ? new Date(values.lastDate) : null, // Send Date object
      description: values.description
    };
    
    mutate(
      {
        url,
        method,
        data: apiData
      }, {
      onSuccess: ({ message }) => {
        toast.success(message || (isUpdateMode ? "Job updated successfully" : "Job created successfully"));
        setOpen(false);
        fetchCareerList();
      },
      onError: () => {
        toast.error(isUpdateMode ? "Failed to update job" : "Failed to create job");
      },
    }
    );
  }

  return (
    <Formik 
      initialValues={initialValues} 
      validationSchema={validationSchema} 
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, errors, touched, isValid }) => {
        const hasRequiredFields = values.title && values.location && values.description && values.lastDate;
        return <Form>
          <Box display="flex" flexDirection="column" gap="12px">
            <FormControl control='input' label='Job Title' name='title' placeholder="Enter job title" />
            <FormControl control='input' label='Job Location' name='location' placeholder="Enter job location" />
            <FormControl control='date' label='Last date of submission' name='lastDate' placeholder="dd/mm/yyyy" />
            <FormControl control='textarea' label='Job Description' name='description' placeholder="Enter job description..." />
            <Box display="flex" justifyContent="space-between" mt={1.5}>
              <CustomButton onClick={() => setOpen(false)}>Cancel</CustomButton>
              <CustomButton 
                type="submit" 
                disabled={!hasRequiredFields || isLoading}
                sx={{
                  opacity: hasRequiredFields ? 1 : 0.6,
                }}
              >
                {isUpdateMode ? "Update Job" : "Add Job"} {isLoading && "..."}
              </CustomButton>
            </Box>
          </Box>
        </Form>
      }}
    </Formik>
  );
};

export default CreateJob;
