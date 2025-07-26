import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Avatar, InputBase, Pagination, PaginationItem, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import PostApi from "services/api/post";
import NoData from "components/NoData";
import Loader from "components/Loader";

const ReportsTable = ({ searchTerm }) => {
  const { id: postId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;
  // Filter reports by searchTerm (case-insensitive, matches name, username, or type)
  const filteredReports = reports.filter(row => {
    const search = searchTerm?.toLowerCase() || "";
    const name = row.reportedBy?.name || "-";
    const username = row.reportedBy?.email ? `@${row.reportedBy.email.split("@")[0]}` : "";
    const type = Array.isArray(row.reportCategory) && row.reportCategory.length > 0 ? row.reportCategory[0] : "-";
    return (
      name.toLowerCase().includes(search) ||
      username.toLowerCase().includes(search) ||
      type.toLowerCase().includes(search)
    );
  });
  const totalPages = Math.ceil(filteredReports.length / limit);
  const paginatedReports = filteredReports.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await PostApi.getReports(postId);
        if (response?.statusCode === 200 && Array.isArray(response.data?.reports)) {
          setReports(response.data.reports);
        } else {
          setReports([]);
        }
      } catch (err) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [postId]);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  if (loading) return <Loader />;
  return (
    <Box>
      {/* Removed internal search bar here */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "none", border: "1px solid #ECECEC" }}>
        <Table sx={{ minWidth: 650, border: "1px solid #ECECEC", borderRadius: "12px !important", overflowX: 'auto', shadow: "none !important" }}>
          <TableHead sx={{ bgcolor: "#F4F7FA" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 3, pr: 1, width: 120, minWidth: 100, whiteSpace: 'nowrap' }}>Reported By</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 100, minWidth: 80, whiteSpace: 'nowrap' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, maxWidth: 320, width: 320, minWidth: 200, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>Report Type</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 110, minWidth: 90, whiteSpace: 'nowrap' }}>Time Reported</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 110, minWidth: 90, whiteSpace: 'nowrap' }}>Date Reported</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReports.length > 0 ? paginatedReports.map((row) => {
              const name = row.reportedBy?.name || "-";
              const username = row.reportedBy?.email ? `@${row.reportedBy.email.split("@")[0]}` : "";
              const avatar = row.reportedBy?.avatar || "/avatar.jpg";
              const type = Array.isArray(row.reportCategory) && row.reportCategory.length > 0 ? row.reportCategory[0] : "-";
              const date = row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-";
              const time = row.createdAt ? new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
              return (
                <TableRow key={row._id}>
                  <TableCell sx={{ width: 120, minWidth: 100 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={avatar} alt={name} sx={{ width: 32, height: 32 }} />
                      <Typography noWrap>{name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: 100, minWidth: 80 }}>{username}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 320,
                      width: 320,
                      minWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      py: 1.5,
                    }}
                  >
                    {type}
                  </TableCell>
                  <TableCell sx={{ width: 110, minWidth: 90 }}>{time}</TableCell>
                  <TableCell sx={{ width: 110, minWidth: 90 }}>{date}</TableCell>
                </TableRow>
              );
            }) : (!loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <NoData message="No Data Available" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination controls - match comments style, always show */}
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
    </Box>
  );
};

export default ReportsTable; 