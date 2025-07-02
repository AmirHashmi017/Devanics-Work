import React, { useEffect, useState } from "react";
import { PLAN } from "services/constants";
import SinglePlan from "./components/SinglePlan";
import { Grid } from "@mui/material";
import NoData from "components/NoData";
import useApiQuery from "hooks/useApiQuery";
import Loader from "../../../components/Loader";
import Error from "components/Error";

const Plans = () => {
  const [semiAnuallyExist, setSemiAnuallyExist] = useState(false);
  const {
    isLoading,
    error,
    data: apiResponse,
  } = useApiQuery({ queryKey: "plans", url: PLAN + "list" });

  useEffect(() => {
    if (apiResponse) {
      const semiAnuallyPlan = apiResponse.data.find(
        ({ duration }) => duration === 6,
      );
      if (semiAnuallyPlan) {
        setSemiAnuallyExist(true);
      }
    }
  }, [apiResponse]);

  if (isLoading) return <Loader />
  if (error) return <Error error={error} />;

  return (
    <div>
      <Grid container spacing={2} mt={3}>
        {apiResponse &&
          (apiResponse.data.length > 0 ? (
            apiResponse.data.map((planData) => (
              <Grid key={planData._id} item xs={12} sm={6} md={4}>
                <SinglePlan semiAnuallyExist={semiAnuallyExist} {...planData} />
              </Grid>
            ))
          ) : (
            <NoData />
          ))}
      </Grid>
    </div>
  );
};

export default Plans;
