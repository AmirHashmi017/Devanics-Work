import React from "react";
import { CustomButton, CustomDatePicker, CustomTextField } from "components";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { PLAN, PROMO } from "services/constants";
import * as yup from "yup";
import { useFormik } from "formik";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import useApiQuery from "hooks/useApiQuery";
import useApiMutation from "hooks/useApiMutation";
import ErrorMsg from "components/ErrorMsg";
import moment from "moment";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { generateRandomString } from "utils";

const CreatePromo = ({ setOpen, promoData = null }) => {
  const queryClient = useQueryClient();
  const fetchPromoList = () =>
    queryClient.invalidateQueries({ queryKey: "promos" });
  const { data: plansApiResponse } = useApiQuery({
    queryKey: "plans",
    url: PLAN + "list",
  });

  const { mutate, isLoading } = useApiMutation();

  const initalValues = {
    code: promoData?.code || "",
    type: promoData?.type || "",
    amount: promoData?.amount || "",
    appliedTo: promoData?.appliedTo || "",
    startDate: promoData?.startDate || "",
    endDate: promoData?.endDate || "",
  };

  const validationSchema = yup.object().shape({
    code: yup.string().required("Code is required"),
    type: yup.string().required("Type is required"),
    amount: yup.string().required("Amount is required"),
    appliedTo: yup.string().required("Plan is required"),
    startDate: yup.string().required("Start Date is required"),
    endDate: yup.string().required("End Date is required"),
  });

  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { startDate, endDate } = values;
      const startD = dayjs(startDate).format('MM-DD-YYYY');
      const endD = dayjs(endDate).format('MM-DD-YYYY');
      const isEndDateValid = moment(endD).isBefore(startD);
      const isStartDateValid = moment(startD).isAfter(endD);
      if (isEndDateValid || isStartDateValid) {
        toast.error("Dates are invalid");
        return;
      }
      mutate(
        {
          url: PROMO + "create",
          data: { ...values, amount: +values.amount },
        },
        {
          onSuccess: () => {
            setOpen(false);
            fetchPromoList();
          },
        }
      );
    },
  });
  const { code, type, amount, appliedTo, startDate, endDate } = values;

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap="12px">
        <div>
          <Box
            component="label"
            htmlFor="code"
            fontSize="14px"
            fontWeight="500"
          >
            Promo Code
          </Box>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              mt: "6px",
            }}
          >
            <InputBase
              size="small"
              // readOnly
              value={code}
              onChange={({ target }) => setFieldValue("code", target.value)}
              sx={{ ml: 1, flex: 1, borderRadius: "8px" }}
              placeholder="Promo Code"
              inputProps={{ "aria-label": "search google maps" }}
            />
            <Button
              sx={{
                color: "#EF9F28",
                textDecoration: "underline",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onClick={() => setFieldValue('code', generateRandomString(6))}
            >
              Generate Code
            </Button>
          </Paper>
        </div>
        {touched.code && errors.code && <ErrorMsg error={errors.code} />}
        <div>
          <Box
            component="label"
            htmlFor="type"
            fontSize="14px"
            fontWeight="500"
          >
            Type
          </Box>
          <Box mt="6px">
            <Select
              onChange={(event) => setFieldValue("type", event.target.value)}
              value={type}
              id="type"
              size="small"
              fullWidth
            >
              <MenuItem value="percentage">Percentage % </MenuItem>
              <MenuItem value="price">Fix Price</MenuItem>
            </Select>
          </Box>
        </div>
        {touched.type && errors.type && <ErrorMsg error={errors.type} />}
        <div>
          <Box
            component="label"
            htmlFor="amount"
            fontSize="14px"
            fontWeight="500"
          >
            Discount Value
          </Box>
          <Box mt="6px">
            <CustomTextField
              size="small"
              name="amount"
              id="amount"
              type="number"
              value={amount}
              placeholder="Enter discount value"
              onChange={({ target }) => setFieldValue("amount", target.value)}
            />
          </Box>
          {touched.amount && errors.amount && <ErrorMsg error={errors.amount} />}
        </div>
        <div>
          <Box
            component="label"
            htmlFor="appliedTo"
            fontSize="14px"
            fontWeight="500"
          >
            Applied To
          </Box>
          <Box mt="6px">
            {plansApiResponse && (
              <Select
                onChange={(event) =>
                  setFieldValue("appliedTo", event.target.value)
                }
                value={appliedTo}
                id="duration"
                size="small"
                fullWidth
              >
                {plansApiResponse.data.map(({ name, _id }) => (
                  <MenuItem key={_id} value={_id}>{name}</MenuItem>
                ))}
              </Select>
            )}
          </Box>
          {touched.appliedTo && errors.appliedTo && <ErrorMsg error={errors.appliedTo} />}
        </div>
        <Box display="flex" gap="14px">
          <div>
            <CustomDatePicker
              label="Start Date"
              disablePast
              name="startDate"
              value={startDate}
              onChange={({ target: { value } }) =>
                setFieldValue("startDate", value)
              }
            />
            {touched.startDate && errors.startDate && <ErrorMsg error={errors.startDate} />}
          </div>
          <div>
            <CustomDatePicker
              label="Expiry Date"
              name="endDate"
              disablePast
              value={endDate}
              onChange={({ target: { value } }) =>
                setFieldValue("endDate", value)
              }
            />
            {touched.endDate && errors.endDate && <ErrorMsg error={errors.endDate} />}
          </div>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={6}>
          <CustomButton onClick={() => setOpen(false)}>Cancel</CustomButton>
          <CustomButton type="submit">
            {promoData ? "Update" : "Generate"} {isLoading && "..."}
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default CreatePromo;
