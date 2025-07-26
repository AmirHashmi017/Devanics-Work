import React, { useEffect, useState, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SingleUser from "./components/SingleUser";
import Loader from "components/Loader";
import NoData from "components/NoData";
import { Box, IconButton, Pagination, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {GET_BOARDROOM_REPORTS} from "services/constants"
import api from "utils/axios";



export default function UserManagementTable({ searchTerm, limit }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${GET_BOARDROOM_REPORTS}`);
      setReports(res?.data?.data?.reports || []);
    } catch (e) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Local search (case-insensitive, matches reported user, reported by, or reason)
  const filteredReports = reports.filter((row) => {
    const search = searchTerm?.toLowerCase() || "";
    const reportedUser = row.reportedUser?.firstName || row.reportedUser?.name || "";
    const reportedBy = row.reportedBy?.firstName || row.reportedBy?.name || "";
    const reason = row.message || "";
    return (
      reportedUser.toLowerCase().includes(search) ||
      reportedBy.toLowerCase().includes(search) ||
      reason.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredReports.length / limit);
  const paginatedReports = filteredReports.slice((page - 1) * limit, page * limit);

  if (loading) return <Loader />;

  return (
    <>
      <TableContainer component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "none",
          border: "1px solid #ECECEC",
        }}>
        <Table
          sx={{
            minWidth: 850,
            border: "1px solid #ECECEC",
            borderRadius: "12px !important",
            overflowX: 'auto',
            shadow: "none !important",
          }}
        >
          <TableHead sx={{ bgcolor: "#F4F7FA", }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, p: 1.3 }}>Reported User </TableCell>
              <TableCell align="center" sx={{ fontWeight: 500, p: 1.3 }}>
                Reported Category
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 500, p: 1.3 }}>
                Report Time
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 500, p: 1.3 }}>
                Reported by
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 500, p: 1.3 }}>
                Reason
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 500, p: 1.3 }}>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 500, p: 1.3 }}>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReports.length > 0 ? paginatedReports.map((report) => (
              <SingleUser key={report._id} {...report} refetchReports={fetchReports} />
            )) : (
              <TableRow>
                <TableCell colSpan={7}><NoData /></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination controls - always show if more than 1 page */}
      {totalPages > 1 && (
        <Box width={1} mt="20px" display="flex" justifyContent="space-between" alignItems="center">
          <IconButton
            onClick={() => setPage(page - 1)}
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
            onChange={(_, value) => setPage(value)}
            count={totalPages}
            siblingCount={1}
            boundaryCount={1}
            color="standard"
            shape="rounded"
          />
          <IconButton
            type="button"
            onClick={() => setPage(page + 1)}
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
    </>
  );
}
