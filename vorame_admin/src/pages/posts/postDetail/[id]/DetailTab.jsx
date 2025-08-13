import React, { useState, useEffect } from "react";
import PostApi from "services/api/post";
import { FilterList, Search as SearchIcon } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Avatar,
  Typography,
  Grid,
  Card,
  LinearProgress,
  Checkbox,
  Menu,
  MenuItem,
  Box,
  Tabs,
  Tab,
  Paper,
  IconButton,
  InputBase,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CommentsTable from "./CommentsTable";
import LikesTable from "./LikesTable";
import ReportsTable from "./ReportsTable";
import Loader from "components/Loader";
import Error from "components/Error";

const tabOptions = ["All Comments", "All Likes", "All Reports"];

const DetailTab = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockStatus, setBlockStatus] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await PostApi.getPostDetails(id);
        const post = response?.data?.messages?.[0];
        if (!post) {
          setError("Post not found");
          setData(null);
        } else {
          // Map backend post to UI structure
          let pollData = undefined;
          if (post.msgType === "poll") {
            const totalVotes = post.totalVotes || 0;
            pollData = {
              options: (post.pollOptions || []).map((opt, idx) => {
                const votes = post.votesPerOption && post.votesPerOption[idx]
                  ? post.votesPerOption[idx].voteCount
                  : 0;
                const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                return {
                  label: opt,
                  percentage,
                  selected: false,
                };
              }),
              totalVotes,
              timeLeft: "",
            };
          }
          const mappedData = {
            id: post._id,
            profileImage: post.postedBy?.avatar || "/avatar.jpg",
            fullName: post.postedBy?.name || "-",
            username: post.postedBy?.email ? `@${post.postedBy.email.split("@")[0]}` : "",
            text: post.message || post.pollDescription || "",
            pollData,
            totalimpressions: post.readBy?.length || 0,
            totallikes: post.likes || 0,
            totalcomments: post.comments || 0,
            report: post.reportBy?.length || 0,
            files: post.files || [],
            title: post.title || "",
            postedBy:post.postedBy,
          };
          setData(mappedData);
          setBlockStatus(post.postedBy?.isBoardroomBlocked || false);
          setSelectedImageIdx(0); // Reset selected image on new post
        }
      } catch (err) {
        setError("Failed to fetch post");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);

  // Delete post handler
  const handleDelete = async (event) => {
    event?.preventDefault && event.preventDefault();
    setIsDeleting(true);
    try {
      const response = await PostApi.deletePost(id);
      if (response?.statusCode === 200) {
        toast.success(response.message || "Post deleted successfully");
        navigate(-1); // Go back to previous page
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
      console.log(data)
      const response = await PostApi.blockUser(data?.postedBy?._id);
      if (response?.statusCode === 200) {
        toast.success(response.message || (blockStatus ? "User unblocked successfully" : "User blocked successfully"));
        setBlockStatus(!blockStatus); // Toggle local status
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

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <CommentsTable searchTerm={searchTerm} />;
      case 1:
        return <LikesTable searchTerm={searchTerm} />;
      case 2:
        return <ReportsTable searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error error={error} />;
  if (!data) {
    return (
      <Box p={3}>
        <Typography variant="h6">Post not found.</Typography>
      </Box>
    );
  }

  const isPoll = data?.pollData?.options || data?.options;
  const poll = data.pollData || data;

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Post Details
      </Typography>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "none",
          maxWidth: "100%",
          margin: "auto",
          border: "1px solid #EAECEE",
          marginBottom: "16px",
          display: Array.isArray(data.files) && data.files.length > 0 && data.files[0].url ? "flex" : "block",
          width: "100%",
          overflow: "hidden", // important to prevent overflow
          p: 2,
        }}
      >
        {/* Image gallery: show if there are images */}
        {Array.isArray(data.files) && data.files.length > 0 && data.files[0].url && (
          <Box display="flex" flexDirection="row" alignItems="flex-start" mr={2}>
            {/* Large image */}
            <Box
              component="img"
              src={data.files[selectedImageIdx]?.url}
              alt={data.files[selectedImageIdx]?.name || "Post related"}
              sx={{
                width: 304,
                height: 304,
                objectFit: "cover",
                flexShrink: 0,
                borderRadius: 2,
                mb: 1,
              }}
            />
            {/* Thumbnails (all, up to 4) */}
            {data.files.length > 1 && (
              <Box display="flex" flexDirection="column" gap={1} ml={2}>
                {data.files.slice(0, 4).map((img, idx) => (
                  <Box
                    key={img._id || idx}
                    component="img"
                    src={img.url}
                    alt={img.name || `post-img-${idx}`}
                    onClick={() => setSelectedImageIdx(idx)}
                    sx={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: selectedImageIdx === idx ? "2px solid #1976d2" : "1px solid #EAECEE",
                      cursor: selectedImageIdx === idx ? "default" : "pointer",
                      mb: 1,
                      opacity: selectedImageIdx === idx ? 1 : 0.8,
                      transition: 'border 0.2s, opacity 0.2s',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        {/* Wrap image and content in a fragment to ensure valid JSX */}
        <>
          {/* Show image only if there is at least one file */}
          {/* This block is now redundant if the gallery is always shown */}
          {/* {Array.isArray(data.files) && data.files.length > 0 && data.files[0].url && (
        <Box
          component="img"
              src={data.files[0].url}
              alt={data.files[0].name || "Post related"}
          sx={{
            width: 266, // adjust as needed
            height: 266,
            objectFit: "cover",
            flexShrink: 0,
            borderRadius: 2,
                mr: 2,
          }}
        />
          )} */}
        {/* Right side content */}
          <Box flex={1} p={1}
           display={isPoll ? undefined : "flex"}
           flexDirection={isPoll ? undefined : "column"}
           justifyContent={isPoll ? undefined : "space-between"}
           height={isPoll ? undefined : 280}
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
                  disableScrollLock
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
                    <MenuItem onClick={handleDelete} disabled={isDeleting}>
                      Delete Post
                    </MenuItem>
                    <MenuItem onClick={handleBlockUser} disabled={isBlocking}>
                      {blockStatus ? "Unblock This User" : "Block This User"}
                    </MenuItem>
                </Menu>
                </Box>
              </Box>
            </Box>
          {/* Content */}
          <Box mb={3}>
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
                        <Typography fontSize={14}>
                          {option.percentage}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
                <Typography fontSize={13} color="gray" mt={1}>
                  {poll.totalVotes} Votes • {poll.timeLeft} left
                </Typography>
                  {/* Stats: poll case, render immediately after poll with vertical gap */}
                  <Grid container spacing={1} gap={1} marginLeft="0px !important" marginRight="0px !important" mt={2}>
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
              </>
            ) : (
                <>
                  <Typography
                    fontSize={16}
                    color="text.primary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '72px', // ensures 3 lines space even if short
                      mb: 7,
                    }}
                  >
                {data.text}
              </Typography>
                  {/* Stats: non-poll, fix at bottom */}
                  <Box mt="auto">
          
          <Grid container spacing={1} gap={1} marginLeft="0px !important" marginRight="0px !important">
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
        
        </Box>
                </>
              )}
            </Box>
          </Box>
        </>
      </Card>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          textColor="primary"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{ minHeight: 40 }}
        >
          {tabOptions.map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                textTransform: "none",
                fontWeight: selectedTab === index ? 600 : 400,
                fontSize: "16px",
                color: selectedTab === index ? "#000 !important" : "#6c757d",
                backgroundColor:
                  selectedTab === index ? "#F5F5F5" : "transparent",
                borderRadius: "8px",
                minHeight: 40,
                px: 2,
                mr: 1,
              }}
            />
          ))}
        </Tabs>
        <Box display="flex" alignItems="center" gap={2}>
          <Paper
            component="form"
            sx={{
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              width: 280,
              borderRadius: "8px",
              height: "40px !important",
              backgroundColor: "#F4F5F6",
              boxShadow: "none",
            }}
            onSubmit={e => e.preventDefault()}
          >
            <IconButton type="button" sx={{ p: 0.5 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "14px" }}
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </Paper>
        </Box>
      </Box>
      <Box mt={3}>{renderTabContent()}</Box>
    </Box>
  );
};

const StatBox = ({ icon, label, value }) => (
  <Box spacing={2} xs={6} sm={3} width="24%" >
    <Box
      display="flex"
      flexDirection="column" // to align in columns
      alignItems="flex-start" // align content to the left
      justifyContent="space-between"
      bgcolor="#F1F1F1 !important"
      borderRadius={2}
      paddingY={1}
      paddingX={2}
      height={94}
    >
      {icon}
      <Box mt={1}> {/* Add vertical gap between icon and text */}
        <Typography textColor="#51566C" fontSize={14} weight={500} color="gray" mb={0.5}>
          {label}
        </Typography>
        <Typography fontSize={16} fontStyle="bold" fontWeight={700}>{value}</Typography>
      </Box>
    </Box>
  </Box>
);

export default DetailTab;
