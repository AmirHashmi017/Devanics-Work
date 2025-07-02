import React from "react";
import FaqList from "./components/FaqList";
import AddFaq from "./components/AddFaq";
import NoData from "components/NoData";
import { Box } from "@mui/material";
import { FAQ } from "services/constants";
import useApiQuery from "hooks/useApiQuery";

const FaqManager = () => {
  const {
    isLoading,
    error,
    data: apiResponse,
  } = useApiQuery({ queryKey: "faqs", url: FAQ + "list" });

  if (isLoading) return <div>Loading FAQs...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const faqs = apiResponse?.data?.faqs || [];

  return (
    <div>
      <AddFaq />
      <Box mt={3}>
        {faqs.length > 0 ? (
          <FaqList initialFaqs={faqs} />
        ) : (
          <NoData />
        )}
      </Box>
    </div>
  );
};

export default FaqManager;
