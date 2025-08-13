import React, { useState, useRef } from "react";
import { Box, Typography, Paper, InputBase, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { CustomButton } from "components";
import Practices from "./components/Practices";
import CustomDialog from "components/Modal";
import CreatePractice from "./components/CreatePractice";

const PracticeModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const practicesRef = useRef();

  // Handler to trigger refetch in Practices
  const handleRefetch = () => {
    if (practicesRef.current) {
      practicesRef.current();
    }
  };

  return (
    <Box sx={{ overflowX: "hidden", overflowY: "auto" }} p={2}>
      <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
        <Typography sx={{fontSize: "24px", fontWeight: 600,  }}>Concepts</Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="stretch"
          gap={2}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 300,
              bgcolor: "#F4F5F6",
              boxShadow: 'none',
              borderRadius: "8px"
            }}
          >
            <IconButton type="button" sx={{ p: "5px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              size="small"
              value={searchTerm}
              onChange={({ target }) => setSearchTerm(target.value)}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "search google maps" }}
            />
          </Paper>
          <CustomButton startIcon={<Add />} onClick={() => setOpenAdd(true)}>
            Add
          </CustomButton>
        </Box>
      </Box>

      <CustomDialog open={openAdd} onClose={() => setOpenAdd(false)} title="Add Concepts">
        <CreatePractice setOpen={setOpenAdd} onSuccess={handleRefetch} />
      </CustomDialog>
      
      <Practices
        searchTerm={searchTerm}
        setRefetch={ref => (practicesRef.current = ref)}
      />
    </Box>
  );
};

export default PracticeModule;
