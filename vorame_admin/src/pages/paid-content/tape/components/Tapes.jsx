import React, { useEffect, useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import SingleTranquility from "../components/SingleTape";
import TranquilityApi from "services/api/tranquility";
import NoData from "components/NoData";
import Loader from "components/Loader";
import Error from "components/Error";
import { useQuery } from "react-query";

const LIMIT = 25;

const Tapes = ({ searchTerm }) => {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { data: apiResponse, isLoading, isError, error, refetch } = useQuery(
    ["tranquilities", offset],
    () => TranquilityApi.getTranquilities(offset, LIMIT),
    {
      keepPreviousData: true,
    }
  );

  const tranquilityList = apiResponse?.tranquilties || [];

  useEffect(() => {
    if (tranquilityList.length > 0) {
      setHasMore(tranquilityList.length === LIMIT);
    }
  }, [tranquilityList.length]);

  // Filter client-side for search
  const filteredList = tranquilityList.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  });

  useEffect(() => {
    // Reset and fetch when searchTerm changes
    setOffset(0);
    refetch();
    // eslint-disable-next-line
  }, [searchTerm, refetch]);

  if (isLoading && offset === 0) return <Loader />;
  if (isError) return <Error error={error} />;

  return (
    <Box>
      <Grid container rowSpacing={2} sx={{ marginLeft: 0, marginRight: 0 }}>
        {filteredList && filteredList.length > 0 ? (
          filteredList.map((tranquilityData) => (
            <Grid 
              key={tranquilityData._id} 
              item 
              xs={12} 
              sm={6} 
              md={3}
              sx={{ 
                flex: '0 0 auto'
              }}
            >
              <SingleTranquility {...tranquilityData} />
            </Grid>
          ))
        ) : (
          <NoData />
        )}
      </Grid>
      {hasMore && !isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button variant="contained" onClick={() => setOffset(prev => prev + LIMIT)}>
            Show More
          </Button>
        </Box>
      )}
      {isLoading && offset > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Loader />
        </Box>
      )}
    </Box>
  );
};

export default Tapes;
