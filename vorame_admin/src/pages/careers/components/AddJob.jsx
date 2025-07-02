import React, { useState } from "react";
import CreateJob from "./CreateJob";
import { CustomButton } from "components";
import CustomDialog from "components/Modal";
import { Add } from "@mui/icons-material";
import { Search as SearchIcon } from "@mui/icons-material";
import { Box, Typography, Paper, InputBase, IconButton } from "@mui/material";

const AddJob = ({ searchTerm, setSearchTerm }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomDialog
        title="Add New Job"
        open={open}
        onClose={() => setOpen(false)}
      >
        <CreateJob setOpen={setOpen} />
      </CustomDialog>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography variant="body1" fontWeight={600} fontSize={24}>
          Careers
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          gap={2}
        >
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
          </Paper>
          <CustomButton sx={{ p: 1, borderRadius: '8px' }} startIcon={<Add />} onClick={() => setOpen(true)}>
            Create New Job
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
};

export default AddJob;
