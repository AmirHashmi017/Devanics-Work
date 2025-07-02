import React, { useEffect, useState } from "react";
import Headbar from "./Header";
import JobsTable from "./components/Table";
import { Box, IconButton, Pagination, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(9);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const handlePageChange = (page) => {
    setPage(page);
    setOffset(page > 1 ? (page - 1) * limit : 0);
  };

  useEffect(() => {
    setOffset(0);
    setPage(1);
  }, [searchTerm]);

  return (
    <Box>
      {/* <Headbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
      <Box mt={3}>

        <JobsTable
          searchTerm={searchTerm}
          limit={limit}
          offset={offset}
          setTotal={setTotal}
        />
        {total > 1 && (
          <Box
            width={1}
            mt="20px"
            display="flex"
            justifyContent="space-between"
          >
            <IconButton
              onClick={() => handlePageChange(page - 1)}
              disabled={offset === 0}
              type="button"
              sx={{
                bgcolor: "white",
                border: "1px solid #D0D5DD",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#344054",
                fontWeight: "600",
                px: 1,
              }}
              aria-label="Pevious"
            >
              <ArrowBack />
              <Typography fontSize="inherit" fontWeight="inherit" ml={1}>
                Previous
              </Typography>
            </IconButton>

            <Pagination
              page={page}
              onChange={(_, value) => handlePageChange(value)}
              count={Math.ceil(total / limit)}
            />
            <IconButton
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={offset + limit >= total}
              sx={{
                bgcolor: "white",
                border: "1px solid #D0D5DD",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#344054",
                fontWeight: "600",
                px: 1,
              }}
              aria-label="Next"
            >
              <Typography fontSize="inherit" fontWeight="inherit" mr={1}>
                Next
              </Typography>
              <ArrowForward />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Jobs;
