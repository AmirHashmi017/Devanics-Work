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
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const PostCard = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const isPoll = data?.pollData?.options || data?.options;
  const poll = data.pollData || data;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
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
              <MenuItem onClick={handleCloseMenu}>Hide Post</MenuItem>
              <MenuItem onClick={handleCloseMenu}>Delete Post</MenuItem>
              <MenuItem onClick={handleCloseMenu}>Block This User</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

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
          icon={<RemoveRedEyeOutlinedIcon />}
          label="Total Impressions"
          value={`${data.totalimpressions}k`}
          arrow={<ArrowOutwardIcon />}
        />
        <StatBox
          icon={<FavoriteBorderIcon />}
          label="Total Likes"
          value={data.totallikes}
          arrow={<ArrowOutwardIcon  color="#C4C4C4 !important"/>}
        />
        <StatBox
          icon={<ChatOutlinedIcon />}
          label="Total Comments"
          value={data.totalcomments}
          arrow={<ArrowOutwardIcon />}
        />
        <StatBox
          icon={<ReportProblemOutlinedIcon />}
          label="Reports On Post"
          value={`${data.report}k`}
          arrow={<ArrowOutwardIcon />}
        />
      </Grid>
    </Card>
  );
};

const StatBox = ({ icon, label, value, arrow }) => (
  <Grid item xs={6} sm={3}>
    <Box
      display="flex"
      alignItems="center"
      p={2}
      bgcolor="#F5F5F5 !important "
      borderRadius={2}
      gap={1}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={24}
        height={24}
      >
        {icon}
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography fontSize={12} color="#666" fontWeight={400}>
          {label}
        </Typography>
        <Typography fontSize={20} fontWeight={600} color="#000">
          {value}
        </Typography>
      </Box>
      {arrow && <Box ml="auto">{arrow}</Box>}
    </Box>
  </Grid>
);

export default PostCard;
