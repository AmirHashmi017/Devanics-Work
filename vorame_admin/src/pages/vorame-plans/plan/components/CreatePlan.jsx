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
  { label: "1 Month", value: "1" },
  { label: "6 Month", value: "6" },
  { label: "12 Month", value: "12" },
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
    duration: planData?.duration || 1,
    status: planData?.status || "active",
    discount: planData?.discount || 0,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    price: yup
      .number()
      .min(1, "Price should greater than 1")
      .required("Price is required"),
    duration: yup.number().required("Duration is required"),
    status: yup.string().required("Status is required"),
    discount: yup
      .number()
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%")
      .required("Discount is required"),
  });

  const { setFieldValue, values, handleSubmit, errors } = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      // Round price and discount to 2 decimals before submitting
      const roundedPrice = Number(Number(values.price).toFixed(2));
      const roundedDiscount = Number(Number(values.discount).toFixed(2));
      mutate(
        {
          method: planData ? "put" : "post",
          url: PLAN + (planData ? `update/${planData._id}` : "create"),
          data: { ...values, price: roundedPrice, discount: roundedDiscount },
        },
        {
          onSuccess: handleSuccess,
        }
      );
    },
  });
  const { name, price, duration, status, discount } = values;

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
              placeholder="£"
              type="number"
            />
          </Box>
          {errors.price && <ErrorMsg error={errors.price} />}
        </Box>
        <Box>
          <Box
            component="label"
            htmlFor="discount"
            fontSize="14px"
            fontWeight="500"
          >
            Discount (%)
          </Box>
          <Box mt="6px">
            <CustomTextField
              size="medium"
              name="discount"
              value={discount}
              onChange={({ target }) => setFieldValue("discount", +target.value)}
              placeholder="Enter discount percentage"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              disabled={!!planData}
            />
          </Box>
          {errors.discount && <ErrorMsg error={errors.discount} />}
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
