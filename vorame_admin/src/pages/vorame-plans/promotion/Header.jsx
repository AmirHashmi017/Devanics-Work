import React from "react";
import { Box, Pagination, PaginationItem, IconButton, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import PromosTable from "./components/Table";
import useApiQuery from "hooks/useApiQuery";
import { PLAN } from "services/constants";

const Promotions = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [limit] = React.useState(9);
  const [offset, setOffset] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);

  // Fetch all plans for mappingF
  const { data: plansApiResponse } = useApiQuery({
    queryKey: "plans",
    url: PLAN + "list",
  });
  const plansMap = React.useMemo(() => {
    if (!plansApiResponse) return {};
    const map = {};
    plansApiResponse.data.forEach(plan => {
      map[plan._id] = plan;
    });
    return map;
  }, [plansApiResponse]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (event, value) => {
    setPage(value);
    setOffset(value > 1 ? (value - 1) * limit : 0);
  };

  React.useEffect(() => {
    setOffset(0);
    setPage(1);
  }, [searchTerm]);

  return (
    <Box mt={4}>
      <Box mt={3}>
        <PromosTable
          searchTerm={searchTerm}
          limit={limit}
          offset={offset}
          setTotal={setTotal}
          plansMap={plansMap}
        />
        {totalPages > 1 && (
          <Box width={1} mt="20px" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton
              onClick={() => handlePageChange(null, page - 1)}
              disabled={page === 1}
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
              aria-label="Previous"
            >
              <ArrowBack />
              <Typography fontSize="inherit" fontWeight="inherit" ml={1}>
                Previous
              </Typography>
            </IconButton>
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={totalPages}
              siblingCount={1}
              boundaryCount={1}
              color="standard"
              shape="rounded"
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={item.selected ? {
                    bgcolor: '#F4F7FA',
                    color: '#344054',
                    fontWeight: 700,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    border: 'none',
                  } : {}}
                />
              )}
            />
            <IconButton
              type="button"
              onClick={() => handlePageChange(null, page + 1)}
              disabled={page === totalPages}
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

export default Promotions;
