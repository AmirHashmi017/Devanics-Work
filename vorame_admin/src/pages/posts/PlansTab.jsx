import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  InputBase,
  IconButton,
  Button,
} from "@mui/material";
import { FilterList, Search as SearchIcon } from "@mui/icons-material";
import AllPosts from "./allPosts/index";

const tabOptions = ["All Posts"];

const PostsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <AllPosts searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{fontSize: "24px", fontWeight: 600,  }}>Posts</Typography>
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
            onSubmit={e => e.preventDefault()}
          >
            <IconButton type="button" sx={{ p: 0.5 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "14px" }}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ "aria-label": "search posts" }}
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
