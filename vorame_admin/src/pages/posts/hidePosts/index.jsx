import React, { useEffect, useState } from "react";
import { PLAN } from "services/constants";
import PostCard from "./components/SinglePlan";
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
        ({ duration }) => duration === 6
      );
      if (semiAnuallyPlan) {
        setSemiAnuallyExist(true);
      }
    }
  }, [apiResponse]);

  if (isLoading) return <Loader />;
  if (error) return <Error error={error} />;

  // DummyDataForPosts
  const posts = [
    {
      id: 1,
      profileImage: "/avatar.jpg",
      fullName: "Annette Black",
      username: "@David Beckham",
      pollData: {
        options: [
          { label: "Option 1", percentage: 48, selected: false },
          { label: "Option 2", percentage: 78, selected: true },
          { label: "Option 3", percentage: 88, selected: false },
        ],
        totalVotes: "1,203",
        timeLeft: "10 hours 4 minutes",
      },
      totalimpressions: 2736,
      totallikes: 63,
      totalcomments: 63,
      report: 2736,
    },
    {
      id: 2,
      profileImage: "/avatar.jpg",
      fullName: "Annette Black",
      username: "@David Beckham",
      text: `Wedges and pennants are visual representations of price movements on
    currency charts. Wedges typically indicate a potential reversal, with
    converging trend lines suggesting a weakening trend…`,
      totalimpressions: 2736,
      totallikes: 63,
      totalcomments: 63,
      report: 2736,
    },
      {
      id: 3,
      profileImage: "/avatar.jpg",
      fullName: "Annette Black",
      username: "@David Beckham",
      text: `Wedges and pennants are visual representations of price movements on
    currency charts. Wedges typically indicate a potential reversal, with
    converging trend lines suggesting a weakening trend…`,
      totalimpressions: 2736,
      totallikes: 63,
      totalcomments: 63,
      report: 2736,
    },
    {
      id: 4,
      profileImage: "/avatar.jpg",
      fullName: "Annette Black",
      username: "@David Beckham",
      pollData: {
        options: [
          { label: "Option 1", percentage: 40, selected: false },
          { label: "Option 2", percentage: 65, selected: false },
          { label: "Option 3", percentage: 23, selected: false },
        ],
        totalVotes: "1,203",
        timeLeft: "10 hours 4 minutes",
      },
      totalimpressions: 2736,
      totallikes: 63,
      totalcomments: 63,
      report: 2736,
    },
  ];

  return (
    <div>
      {/* <Grid container spacing={2} mt={3}>
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
      </Grid> */}
      {posts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  );
};

export default Plans;
