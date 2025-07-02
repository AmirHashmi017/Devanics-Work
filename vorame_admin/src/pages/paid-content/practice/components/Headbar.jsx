import { Box, Typography } from "@mui/material";
import React from "react";
import { CustomButton } from "components";
import { Add } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const Headbar = ({ searchTerm, setSearchTerm, onAddClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      marginY={4}
    >
      <Typography variant="body1" fontWeight={600} fontSize={24}>
        Concepts
      </Typography>
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
        <CustomButton
          startIcon={<Add />}
          onClick={onAddClick}
        >
          Add 
        </CustomButton>
      </Box>
    </Box>
  );
};

export default Headbar;
