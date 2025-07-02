import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  InputBase,
  IconButton,
  Button,
} from "@mui/material";
import { FilterList, Search as SearchIcon } from "@mui/icons-material";
import DeletedPost from "./deletedPosts/index";
import AllPosts from "./allPosts/index";
import HidePosts from "./hidePosts/index";

const tabOptions = ["All Posts", "Hide Posts", "Deleted Posts"];

const PostsTab = ({ searchTerm, setSearchTerm }) => {
  const [, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <AllPosts />;
      case 1:
        return <HidePosts />;
      case 2:
        return <DeletedPost />;
      default:
        return null;
    }
  };

  return (
    <Box mt={4}>
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
        <Box display="flex" gap="12px">
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
          >
            <IconButton type="button" sx={{ p: 0.5 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "14px" }}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ "aria-label": "search users" }}
            />
          </Paper>{" "}
          {(selectedTab === 1 || selectedTab === 2) && (
            <Button
              onClick={() => setOpen(true)}
              variant="contained"
              startIcon={<FilterList />}
              sx={{
                backgroundColor: "#010D19",
                color: "#fff",
                boxShadow: "none",
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#010D19",
                },
              }}
            >
              Filter
            </Button>
          )}
        </Box>
      </Box>
      <Box mt={3}>{renderTabContent()}</Box>
    </Box>
  );
};

export default PostsTab;
