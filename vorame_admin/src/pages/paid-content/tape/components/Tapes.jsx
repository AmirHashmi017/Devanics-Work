import React, { useEffect, useState } from "react";
import { Grid, Typography, IconButton, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import SingleTranquility from "../components/SingleTape";
import TranquilityApi from "services/api/tranquility";
import { useQuery } from "react-query";

const LIMIT = 25;

const Tapes = ({ searchTerm }) => {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { data: apiResponse, isLoading, refetch } = useQuery(
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

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Grid container mt={3}>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
                Tranquility
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {}} // Add your add functionality here
                sx={{
                  backgroundColor: "#010D19",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: "none",
                  px: 2.5,
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#010D19",
                  },
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          {filteredList && filteredList.length > 0 ? (
            <Grid container spacing="10px" sx={{ overflowY: "auto", mt: 1 }}>
              {filteredList.map((tranquilityData, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <SingleTranquility {...tranquilityData} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid>
              <Typography variant="subtitle1">
                Currently tranquilities not exists.
              </Typography>
            </Grid>
          )}
          {hasMore && !isLoading && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button variant="contained" onClick={() => setOffset(prev => prev + LIMIT)}>
                Show More
              </Button>
            </Box>
          )}
          {isLoading && offset > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <div>Loading more...</div>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default Tapes;
