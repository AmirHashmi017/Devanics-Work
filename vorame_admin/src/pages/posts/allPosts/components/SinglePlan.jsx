import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Card,
  LinearProgress,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

import { toast } from "react-toastify";
import {
  ConfirmDialog,
} from "../../../../components";
import PostApi from "services/api/post";

const PostCard = ({ data, refetchPosts }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockStatus, setBlockStatus] = useState(data?.postedBy?.isBoardroomBlocked || false);

  const fetchPosts = () => queryClient.invalidateQueries({ queryKey: ["posts"] });

  const handleDelete = async (event) => {
    event?.preventDefault && event.preventDefault();
    setIsDeleting(true);
    try {
      const response = await PostApi.deletePost(data.id);
      if (response?.statusCode === 200) {
        toast.success(response.message || "Post deleted successfully");
        setConfirmOpen(false);
        if (typeof refetchPosts === 'function') refetchPosts();
      } else {
        toast.error(response?.message || "Unable to delete post");
      }
    } catch (error) {
      toast.error("Unable to delete post");
    } finally {
      setIsDeleting(false);
    }
  };
 

  // Block/Unblock user handler
  const handleBlockUser = async (event) => {
    event?.preventDefault && event.preventDefault();
    setIsBlocking(true);
    try {
      // Use postedBy._id as userId (not data.id)
      const response = await PostApi.blockUser(data?.postedBy?._id);
      if (response?.statusCode === 200) {
        toast.success(response.message || (blockStatus ? "User unblocked successfully" : "User blocked successfully"));
        setBlockStatus(prev => !prev); // Toggle local status
        handleCloseMenu();
      } else {
        toast.error(response?.message || "Unable to update block status");
      }
    } catch (error) {
      toast.error("Unable to update block status");
    } finally {
      setIsBlocking(false);
    }
  };

  const isPoll = data?.pollData?.options || data?.options;
  const poll = data.pollData || data;

  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePostDetail = () => {
    handleCloseMenu();
    navigate(`/post/${data.id}`);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Show up to 4 images from data.files (if present), using logic similar to concepts module
  const postImages = Array.isArray(data.files)
    ? data.files
        .filter(img => (typeof img === 'object' && (img.url || img instanceof File)))
        .slice(0, 4)
    : [];

  return (
    <>
      <ConfirmDialog
        title="Delete post"
        dialogContext="Are you sure you want to delete this post? This action cannot be undone."
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
      <ConfirmDialog
        title="Delete post"
        dialogContext="Are you sure you want to delete this post? This action cannot be undone."
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
      <Card
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: "none",
          maxWidth: "100%",
          margin: "auto",
          border: "1px solid #EAECEE",
          marginBottom: "16px",
        }}
      >
        {/* User Info */}
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={data.profileImage || "/avatar.jpg"}
              alt={data.fullName}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Box>
              <Typography fontWeight={600}>{data.fullName}</Typography>
              <Typography fontSize={13} color="gray">
                {data.username}
              </Typography>
            </Box>
          </Box>
          {/* More menu */}
          <Box>
            <Box display="flex" justifyContent="center">
              <Box
                component="img"
                src="/icons/dots-vertical.svg"
                alt="options"
                height="20px"
                onClick={handleOpenMenu}
                sx={{ cursor: "pointer" }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: "8px",
                    mt: 1,
                    minWidth: 158,
                    backgroundColor: "#fff",
                    boxShadow:
                      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
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
                <MenuItem onClick={handlePostDetail}>Post Details</MenuItem>
                <MenuItem onClick={() => { setConfirmOpen(true); handleCloseMenu(); }}>Delete Post</MenuItem>
                <MenuItem onClick={handleBlockUser} disabled={isBlocking}>
                  {blockStatus ? "Unblock This User" : "Block This User"}
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>

        {/* Post Images Row */}
        {postImages.length > 0 && (
          <Box display="flex" gap={1} mb={2}>
            {postImages.map((img, idx) => {
              let src = '';
              if (img instanceof File) {
                src = URL.createObjectURL(img);
              } else if (typeof img.url === 'string' && img.url.startsWith('http')) {
                src = img.url;
              }
              if (!src) return null;
              return (
                <Box
                  key={img._id || idx}
                  component="img"
                  src={src}
                  alt={img.name || `post-img-${idx}`}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #EAECEE",
                  }}
                />
              );
            })}
          </Box>
        )}

        {/* Content */}
        {isPoll ? (
          <>
            {poll.options.map((option, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                mb="4px"
                sx={{
                  border: "1px solid #EAECEE",
                  borderRadius: "9px",
                  overflow: "hidden",
                }}
              >
                <Box flex={1} position="relative">
                  <LinearProgress
                    variant="determinate"
                    value={option.percentage}
                    sx={{
                      height: "36px",
                      borderRadius: "9px !important",
                      backgroundColor: "transparent",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#E5E5E5",
                      },
                    }}
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    pl={1}
                  >
                    <Checkbox checked={option.selected} />
                  </Box>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    pl={6}
                  >
                    <Typography fontSize={14}>{option.label}</Typography>
                  </Box>
                  <Box
                    position="absolute"
                    top={0}
                    right={10}
                    height="100%"
                    display="flex"
                    alignItems="center"
                  >
                    <Typography fontSize={14}>{option.percentage}%</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            <Typography fontSize={13} color="gray" mt={1} mb={3}>
              {poll.totalVotes} Votes • {poll.timeLeft} left
            </Typography>
          </>
        ) : (
          <Typography fontSize={16} color="text.primary" mb={3}>
            {data.text}
          </Typography>
        )}

        {/* Stats */}
        <Grid container spacing={2}>
          <StatBox
            icon={<Box component="img" src="/icons/View.png" alt="impressions" width="20px" height="14px" />}
            label="Total Impressions"
            value={`${data.totalimpressions}`}
          />
          <StatBox
            icon={<Box component="img" src="/icons/Like.png" alt="likes" width="20px" height="17.83px" />}
            label="Total Likes"
            value={data.totallikes}
          />
          <StatBox
            icon={<Box component="img" src="/icons/comment.png" alt="comments" width="18px" height="18.46px" />}
            label="Total Comments"
            value={data.totalcomments}
          />
          <StatBox
            icon={<Box component="img" src="/icons/Report.png" alt="reports" width="20px" height="18px" />}
            label="Reports On Post"
            value={`${data.report}`}
          />
        </Grid>
      </Card>
    </>
  );
};

const StatBox = ({ icon, label, value }) => (
  <Grid item xs={6} sm={3}>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      bgcolor="#F1F1F1 !important"
      borderRadius={2}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography fontSize={12} color="gray">
          {label}
        </Typography>
      </Box>
      <Typography fontWeight={600}>{value}</Typography>
    </Box>
  </Grid>
);

export default PostCard;
