import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import SingleJob from "./SingleJob";
import useApiQuery from "hooks/useApiQuery";
import { CAREER_LIST, CAREERS } from "services/constants";
import Loader from "components/Loader";
import NoData from "components/NoData";

const JobsTable = ({ searchTerm }) => {
  const {
    isLoading,
    isError,
    error,
    data: apiResponse,
  } = useApiQuery({ queryKey: [CAREERS], url: CAREER_LIST });

  const jobList = apiResponse?.data?.careers || [];
  const filteredJobs = jobList.filter(job =>
    job.title?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  if (isLoading) return <Loader />;
  if (isError)
    return <div>Error: {error?.message || "Something went wrong"}</div>;

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "12px",
        boxShadow: "none",
        border: "1px solid #ECECEC",
      }}
    >
      <Table
        sx={{
          minWidth: 850,
          border: "1px solid #ECECEC",
          borderRadius: "12px !important",
          overflowX: "auto",
          boxShadow: "none !important"
        }}
      >
        <TableHead sx={{ bgcolor: "#F4F7FA" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 400, p: 1.3 }}>Job Title</TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Job Location
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Date Posted
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              End Date
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Total Applicants
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <SingleJob key={job._id} {...job} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <NoData />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobsTable;
