import React, { useState, useEffect, useRef } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Avatar, InputBase, Menu, MenuItem, IconButton, Pagination, PaginationItem } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from "react-router-dom";
import PostApi from "services/api/post";
import { toast } from "react-toastify";
import NoData from "components/NoData";
import Loader from "components/Loader";

const CommentsTable = ({ searchTerm }) => {
  const { id: postId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState({});
  const menuRefs = useRef({});
  const [actionLoading, setActionLoading] = useState({}); // { [commentId]: { delete: bool, block: bool } }
  const [page, setPage] = useState(1);
  const limit = 6;
  // Filter comments by searchTerm (case-insensitive, matches name, username, or comment)
  const filteredComments = comments.filter(row => {
    const search = searchTerm?.toLowerCase() || "";
    const name = row.postedBy?.name || "";
    const username = row.postedBy?.email ? `@${row.postedBy.email.split("@")[0]}` : "";
    return (
      name.toLowerCase().includes(search) ||
      username.toLowerCase().includes(search) ||
      (row.content || "").toLowerCase().includes(search)
    );
  });
  const totalPages = Math.ceil(filteredComments.length / limit);
  const paginatedComments = filteredComments.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await PostApi.getComments(postId);
        if (response?.statusCode === 200 && Array.isArray(response.data)) {
          setComments(response.data.map(comment => ({ ...comment, blockStatus: comment.postedBy?.isBoardroomBlocked || false })));
        } else {
          setComments([]);
        }
      } catch (err) {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleOpenMenu = (id) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: menuRefs.current[id] }));
  };

  const handleCloseMenu = (id) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: null }));
  };

  const handleDeleteComment = async (commentId) => {
    setActionLoading((prev) => ({ ...prev, [commentId]: { ...(prev[commentId] || {}), delete: true } }));
    try {
      const response = await PostApi.deleteComment(commentId);
      if (response?.statusCode === 200) {
        toast.success("Message deleted successfully");
        setComments(prev => prev.filter(c => c._id !== commentId));
      } else {
        toast.error(response?.message || "Unable to delete comment");
      }
    } catch (error) {
      toast.error("Unable to delete comment");
    } finally {
      setActionLoading((prev) => ({ ...prev, [commentId]: { ...(prev[commentId] || {}), delete: false } }));
      handleCloseMenu(commentId);
    }
  };

  const handleBlockUser = async (comment) => {
    const userId = comment.postedBy?._id;
    if (!userId) return;
    setActionLoading((prev) => ({ ...prev, [comment._id]: { ...(prev[comment._id] || {}), block: true } }));
    try {
      const response = await PostApi.blockUser(userId);
      if (response?.statusCode === 200) {
        toast.success(response.message || (comment.blockStatus ? "User unblocked successfully" : "User blocked successfully"));
        setComments(prev => prev.map(c => c._id === comment._id ? { ...c, blockStatus: !c.blockStatus } : c));
      } else {
        toast.error(response?.message || "Unable to update block status");
      }
    } catch (error) {
      toast.error("Unable to update block status");
    } finally {
      setActionLoading((prev) => ({ ...prev, [comment._id]: { ...(prev[comment._id] || {}), block: false } }));
      handleCloseMenu(comment._id);
    }
  };

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
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 3, pr: 1, width: 160, minWidth: 120, whiteSpace: 'nowrap' }}>Commented By</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 140, minWidth: 100, whiteSpace: 'nowrap' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 260, minWidth: 180, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>Comment</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 140, minWidth: 100, whiteSpace: 'nowrap' }}>Time Commented</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 160, minWidth: 120, whiteSpace: 'nowrap' }}>Date Commented</TableCell>
              <TableCell sx={{ fontWeight: 500, p: 1.3, pl: 2, pr: 1, width: 120, minWidth: 80, whiteSpace: 'nowrap' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComments.length > 0 ? paginatedComments.map((row) => {
              const name = row.postedBy?.name || "-";
              const username = row.postedBy?.email ? `@${row.postedBy.email.split("@")[0]}` : "";
              const avatar = row.postedBy?.avatar || "/avatar.jpg";
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
                      width: 260,
                      minWidth: 180,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      py: 1.5,
                    }}
                  >
                    {row.content}
                  </TableCell>
                  <TableCell sx={{ width: 80, minWidth: 60 }}>{time}</TableCell>
                  <TableCell sx={{ width: 110, minWidth: 90 }}>{date}</TableCell>
                  <TableCell sx={{ width: 80, minWidth: 60 }}>
                    <Box display="flex" justifyContent="center">
                      <Box
                        component="img"
                        src="/icons/dots-vertical.svg"
                        alt="options"
                        height="20px"
                        sx={{ cursor: "pointer" }}
                        ref={el => menuRefs.current[row._id] = el}
                        onClick={() => handleOpenMenu(row._id)}
                      />
                      <Menu
                        anchorEl={menuAnchor[row._id]}
                        open={Boolean(menuAnchor[row._id])}
                        onClose={() => handleCloseMenu(row._id)}
                        disableScrollLock
                        PaperProps={{
                          elevation: 1,
                          sx: {
                            borderRadius: "8px",
                            mt: 1,
                            minWidth: 158,
                            backgroundColor: "#fff",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                            "& .MuiMenuItem-root": {
                              fontSize: "16px",
                              color: "#344054",
                              px: 2,
                              py: 1.5,
                            },
                          },
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem onClick={() => handleDeleteComment(row._id)} disabled={actionLoading[row._id]?.delete}>
                          Delete Comment
                        </MenuItem>
                        <MenuItem onClick={() => handleBlockUser(row)} disabled={actionLoading[row._id]?.block}>
                          {row.blockStatus ? "Unblock This User" : "Block This User"}
                        </MenuItem>
                      </Menu>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            }) : (!loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <NoData message="No Data Available" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination controls - match promotions style, always show */}
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

export default CommentsTable; 