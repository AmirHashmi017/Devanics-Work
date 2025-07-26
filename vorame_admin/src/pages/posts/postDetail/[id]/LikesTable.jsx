import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Avatar, InputBase, Pagination, PaginationItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import PostApi from "services/api/post";
import NoData from "components/NoData";
import Loader from "components/Loader";

const LikesTable = ({ searchTerm }) => {
  const { id: postId } = useParams();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;
  // Filter likes by searchTerm (case-insensitive, matches name, username, or email)
  const filteredLikes = likes.filter(row => {
    const search = searchTerm?.toLowerCase() || "";
    const name = row.name || row.firstName || row.lastName || "-";
    const username = row.email ? `@${row.email.split("@")[0]}` : "";
    const email = row.email || "";
    return (
      name.toLowerCase().includes(search) ||
      username.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search)
    );
  });
  const totalPages = Math.ceil(filteredLikes.length / limit);
  const paginatedLikes = filteredLikes.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    const fetchLikes = async () => {
      setLoading(true);
      try {
        const response = await PostApi.getLikes(postId);
        if (response?.statusCode === 200 && Array.isArray(response.data)) {
          setLikes(response.data);
        } else {
          setLikes([]);
        }
      } catch (err) {
        setLikes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
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
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 3, pr: 1, width: 220, minWidth: 180, whiteSpace: 'nowrap' }}>Liked By</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 220, minWidth: 180, whiteSpace: 'nowrap' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, maxWidth: 320, width: 320, minWidth: 200, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLikes.length > 0 ? paginatedLikes.map((row) => {
              const name = row.name || row.firstName || row.lastName || "-";
              const username = row.email ? `@${row.email.split("@")[0]}` : "";
              const avatar = row.avatar || "/avatar.jpg";
              const email = row.email || "";
              return (
                <TableRow key={row._id || row.email}>
                  <TableCell sx={{ width: 220, minWidth: 180 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={avatar} alt={name} sx={{ width: 32, height: 32 }} />
                      <Typography noWrap>{name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: 220, minWidth: 180 }}>{username}</TableCell>
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
                    {email}
                  </TableCell>
                </TableRow>
              );
            }) : (!loading && (
              <TableRow>
                <TableCell colSpan={3} align="center">
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

export default LikesTable; 