import React from "react";
import { CustomButton } from "components";
import { Box } from "@mui/material";
import { PLAN, PROMOTION } from "services/constants";
import * as yup from "yup";
import { Form, Formik } from "formik";
import useApiQuery from "hooks/useApiQuery";
import useApiMutation from "hooks/useApiMutation";
import moment from "moment";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FormControl from "components/FormControl";
import dayjs from "dayjs";
import Loader from "components/Loader";

const CreatePromotion = ({ setOpen, promotionData = null }) => {
  const queryClient = useQueryClient();
  const fetchPromoList = () =>
    queryClient.invalidateQueries({ queryKey: "promotions" });
  const { data: plansApiResponse } = useApiQuery({
    queryKey: "plans",
    url: PLAN + "list",
  });

  const { planId = '',
    title = '',
    startDate = null,
    endDate = null,
    discount = '',
    type = '' } = promotionData || {};

  const { _id = '' } = planId || {};

  const { mutate, isLoading } = useApiMutation();

  const initalValues = {
    planId: _id,
    title,
    startDate,
    endDate,
    discount,
    type,
  };


  const validationSchema = yup.object().shape({
    planId: yup.string().required("PlanId is required"),
    title: yup.string().required("Title is required"),
    startDate: yup.string().required("Start Date is required"),
    endDate: yup.string().required("End Date is required"),
    discount: yup.string().required("Discount is required"),
    type: yup.string().required("Type is required"),
  });

  const handleSubmit = (values) => {
    const { startDate, endDate } = values;
    const startD = dayjs(startDate).format('MM-DD-YYYY');
    const endD = dayjs(endDate).format('MM-DD-YYYY');
    const isEndDateValid = moment(endD).isBefore(startD);
    const isStartDateValid = moment(startD).isAfter(endD);
    if (isEndDateValid || isStartDateValid) {
      toast.error("Dates are invalid");
      return;
    }
    const { planId, ...promotionValue } = values;
    mutate(
      {
        method: promotionData ? 'put' : 'post',
        url: PROMOTION + (promotionData ? promotionData._id : planId),
        data: promotionData ? values : promotionValue,
      }, {
      onSuccess: () => {
        setOpen(false);
        fetchPromoList();
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
              <FormControl control='input' label='Promotion Title' name='title' placeholder="Enter title" />
              {
                plansApiResponse ? (
                  <FormControl control='select' label='Select active plan' name='planId' placeholder="Select Plan" options={
                    plansApiResponse.data.map(({ name, _id }) => (
                      { label: name, value: _id }
                    ))
                  } />
                ) : <Loader />
              }
              <Box display="flex" gap="14px">
                <FormControl control='date' label='Start Date' name='startDate' placeholder="Select Month" />
                <FormControl control='date' label='End Date' name='endDate' placeholder="Select Month" />
              </Box>
              <FormControl control='select' label='Type' name='type' placeholder="Select Plan" options={
                [{ label: 'Percentage %', value: 'percentage' }, { label: 'Fix Price', value: 'flat' }]
              } />
              <FormControl type='number' control='input' label='Discount' name='discount' placeholder="10%" />
              <Box display="flex" justifyContent="space-between" mt={1.5}>
                <CustomButton onClick={() => setOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit">
                  {promotionData ? "Update" : "Add"} {isLoading && "..."}
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
