import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Radio,
  MenuItem,
  Select,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useQueryClient } from "react-query";
import { CustomButton, CustomTextField } from "components";
import { PLAN } from "services/constants";
import { toast } from "react-toastify";
import ErrorMsg from "components/ErrorMsg";
import useApiMutation from "hooks/useApiMutation";

const APP_PLANS = [
  { label: "Lifetime", value: "-1" },
  { label: "12 Month", value: "12" },
  { label: "6 Month", value: "6" },
];

const CreatePlan = ({ setOpen, planData = null }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApiMutation();

  const fetchPlans = () => queryClient.invalidateQueries({ queryKey: "plans" });

  const handleSuccess = ({ message }) => {
    setOpen(false);
    toast.success(message);
    fetchPlans();
  };
  const initalValues = {
    name: planData?.name || "",
    price: planData?.price || "",
    duration: planData?.duration || -1,
    status: planData?.status || "active",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    price: yup
      .number()
      .min(1, "Price should greater than 1")
      .required("Price is required"),
    duration: yup.number().required("Duration is required"),
    status: yup.string().required("Status is required"),
  });

  const { setFieldValue, values, handleSubmit, errors } = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      mutate(
        {
          method: planData ? "put" : "post",
          url: PLAN + (planData ? `update/${planData._id}` : "create"),
          data: { ...values, discount: values.duration > 6 ? 10 : 0 },
        },
        {
          onSuccess: handleSuccess,
        }
      );
    },
  });
  const { name, price, duration, status } = values;

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap="12px">
        <div>
          <Box
            component="label"
            htmlFor="name"
            fontSize="14px"
            fontWeight="500"
          >
            Plan Name
          </Box>
          <Box mt="6px">
            <CustomTextField
              size="medium"
              name="name"
              id="name"
              value={name}
              placeholder="Enter Name"
              type="text"
              onChange={({ target }) => setFieldValue("name", target.value)}
            />
          </Box>
          {errors.name && <ErrorMsg error={errors.name} />}
        </div>
        <Box>
          <Box
            component="label"
            htmlFor="duration"
            fontSize="14px"
            fontWeight="500"
          >
            Duration
          </Box>
          <Select
            onChange={(event) => setFieldValue("duration", +event.target.value)}
            value={duration}
            id="duration"
            disabled={planData ? true : false}
            fullWidth
          >
            {APP_PLANS.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
          {errors.duration && <ErrorMsg error={errors.duration} />}
        </Box>
        <Box>
          <Box
            component="label"
            htmlFor="price"
            fontSize="14px"
            fontWeight="500"
          >
            Price
          </Box>
          <Box mt="6px">
            <CustomTextField
              size="medium"
              name="price"
              value={price}
              disabled={planData ? true : false}
              onChange={({ target }) => setFieldValue("price", +target.value)}
              placeholder="USD"
              type="number"
            />
          </Box>
          {errors.price && <ErrorMsg error={errors.price} />}
        </Box>
        <Box component="label" htmlFor="name" fontSize="14px" fontWeight={500}>
          Change Status
        </Box>
        <RadioGroup
          row
          name="status"
          value={status}
          onChange={({ target }) => setFieldValue("status", target.value)}
          defaultValue="active"
        >
          <FormControlLabel
            value="active"
            color="#475467"
            control={<Radio />}
            label="Active"
          />
          <FormControlLabel
            color="#475467"
            value="inactive"
            control={<Radio />}
            label="Inactive"
          />
        </RadioGroup>
        <Box display="flex" justifyContent="space-between">
          <CustomButton disabled={isLoading} onClick={() => setOpen(false)}>
            Cancel
          </CustomButton>
          <CustomButton disabled={isLoading} type="submit">
            {planData ? "Update" : "Add"} {isLoading && "..."}
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default CreatePlan;
