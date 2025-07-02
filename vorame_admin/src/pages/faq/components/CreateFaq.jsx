import React from "react";
import { CustomButton } from "components";
import { Box } from "@mui/material";
import { useQueryClient } from "react-query";
import { FAQ } from "services/constants";
import * as yup from "yup";
import { useFormik } from "formik";
import QuillEditor from "components/QuillEditor/QuillEditor";
import { toast } from "react-toastify";
import ErrorMsg from "components/ErrorMsg";
import useApiMutation from "hooks/useApiMutation";
const CreateFaq = ({ setOpen, faqData = null }) => {
  const queryClient = useQueryClient();
  const fetchFaqList = () =>
    queryClient.invalidateQueries({ queryKey: "faqs" });
  const { mutate, isLoading } = useApiMutation();

  const handleSuccess = (message) => {
    toast.success(message);
    fetchFaqList();
    setOpen(false);
  };

  const initalValues = {
    question: faqData?.question || "",
    description: faqData?.description || "",
  };

  const validationSchema = yup.object().shape({
    question: yup.string().required("Question is required"),
    description: yup.string().required("Description is required"),
  });

  const { setFieldValue, values, errors, handleSubmit } = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (faqData) {
        mutate(
          { url: FAQ + "update", data: { id: faqData._id, ...values } },
          {
            onSuccess: ({ message }) => handleSuccess(message),
          },
        );
      } else {
        mutate(
          { url: FAQ + "create", data: values },
          {
            onSuccess: ({ message }) => handleSuccess(message),
          },
        );
      }
    },
  });

  const { question, description } = values;

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap="12px">
        <Box>
          <Box
            component="label"
            htmlFor="question"
            fontSize="14px"
            fontWeight="500"
          >
            Question
          </Box>
          <Box mt="6px">
            <Box
              py={1}
              value={question}
              onChange={({ target }) => setFieldValue("question", target.value)}
              px="14px"
              borderRadius={1}
              border="1px solid #D0D5DD"
              boxShadow="0px 1px 2px 0px #1018280D"
              placeholder="Enter Question"
              rows={5}
              component="textarea"
              width={1}
              name=""
              id=""
            />
          </Box>
        </Box>
        {errors.question && <ErrorMsg error={errors.question} />}

        <Box>
          <QuillEditor
            name="description"
            value={description}
            onChange={(value) => setFieldValue("description", value)}
          />
          {errors.description && <ErrorMsg error={errors.description} />}
        </Box>
        <Box display="flex" justifyContent="space-between" mt={5}>
          <CustomButton onClick={() => setOpen(false)}>Cancel</CustomButton>
          <CustomButton type="submit">
            {faqData ? "Update" : "Add"} {isLoading && "..."}
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default CreateFaq;
