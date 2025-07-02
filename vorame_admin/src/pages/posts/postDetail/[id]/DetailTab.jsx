import React, { useState, useEffect } from "react";
import { FilterList, Search as SearchIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import Promotions from "./promotion/index";
import Plans from "./plan/index";
import AddPromotion from "./promotion/components/AddPromotion";
import AddPlan from "./plan/components/AddPlan";
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
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const tabOptions = ["Plan", "Promotions"];

const mockPosts = [
  {
    id: "1",
    profileImage: "/avatar.jpg",
    fullName: "Annette Black",
    username: "@David Beckham",
    text: `Wedges and pennants are visual representations of price movements on currency charts. Wedges typically indicate a potential reversal, with converging trend lines suggesting a weakening trend, while pennants often signal a brief consolidation before the prevailing trend resumes, aiding traders in identifying potential entry and exit points in the forex market.`,
    totalimpressions: 2736,
    totallikes: 63,
    totalcomments: 63,
    report: 2736,
  },
  {
    id: "2",
    profileImage: "/avatar.jpg",
    fullName: "Annette Black",
    username: "@David Beckham",
    pollData: {
      options: [
        { label: "Option 1", percentage: 48, selected: false },
        { label: "Option 2", percentage: 78, selected: true },
        { label: "Option 3", percentage: 88, selected: false },
      ],
      totalVotes: "1,203",
      timeLeft: "10 hours 4 minutes",
    },
    totalimpressions: 2736,
    totallikes: 63,
    totalcomments: 63,
    report: 2736,
  },
];

const DetailTab = ({ searchTerm, setSearchTerm }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const foundPost = mockPosts.find((post) => post.id === id);
    setData(foundPost);
  }, [id]);

  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Plans />;
      case 1:
        return <Promotions />;
      default:
        return null;
    }
  };

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
          p: 0,
          borderRadius: 2,
          boxShadow: "none",
          maxWidth: "100%",
          margin: "auto",
          border: "1px solid #EAECEE",
          marginBottom: "16px",
          display: "flex",
          width: "100%",
          overflow: "hidden", // important to prevent overflow
          p: 2,
          gap: 2,
        }}
      >
        {/* Left side image (full height) */}
        <Box
          component="img"
          src="/images/post-sample.jpg" // <-- Replace with your actual image path
          alt="Post related"
          sx={{
            width: 266, // adjust as needed
            height: 266,
            objectFit: "cover",
            flexShrink: 0,
            borderRadius: 2,
          }}
        />

        {/* Right side content */}
        <Box flex={1}>
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
              </>
            ) : (
              <Typography fontSize={16} color="text.primary">
                {data.text}
              </Typography>
            )}
          </Box>

          {/* Stats */}
          <Grid container spacing={1} >
            <StatBox
              icon={<RemoveRedEyeOutlinedIcon />}
              label="Total Impressions"
              value={`${data.totalimpressions}k`}
            />
            <StatBox
              icon={<FavoriteBorderIcon />}
              label="Total Likes"
              value={data.totallikes}
            />
            <StatBox
              icon={<ChatOutlinedIcon />}
              label="Total Comments"
              value={data.totalcomments}
            />
            <StatBox
              icon={<ReportProblemOutlinedIcon />}
              label="Reports On Post"
              value={`${data.report}k`}
            />
          </Grid>
        </Box>
      </Card>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          textColor="primary"
          TabIndicatorProps={{ style: { display: "none" } }}
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
        {selectedTab === 0 ? <AddPlan /> : <AddPromotion />}
      </Box>
      <Box mt={3}>{renderTabContent()}</Box>
    </Box>
  );
};

const StatBox = ({ icon, label, value }) => (
  <Grid spacing={2} xs={6} sm={3} >
    <Box
      display="flex"
      flexDirection="column" // to align in columns
      alignItems="flex-start" // align content to the left
      justifyContent="space-between"
      bgcolor="#F1F1F1 !important"
      borderRadius={2}
      paddingY={1}
      paddingX={2}
    >
      {icon}
      <Typography fontSize={12} color="gray">
        {label}
      </Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Box>
  </Grid>
);

export default DetailTab;
