import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CreatePromo from "./CreatePromo";
import { CustomButton } from "components";
import CustomDialog from "components/Modal";
import { Add } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const AddPromo = ({ searchTerm, setSearchTerm }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomDialog
        title="Add Promo"
        open={open}
        onClose={() => setOpen(false)}
      >
        <CreatePromo setOpen={setOpen} />
      </CustomDialog>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography variant="body1" fontWeight={600} fontSize={24}>
          Promos
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
            }}
          >
            <IconButton type="button" sx={{ p: "5px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              size="small"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              inputProps={{ "aria-label": "search google maps" }}
            />
          </Paper>

          <CustomButton startIcon={<Add />} onClick={() => setOpen(true)}>
            Add
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
};

export default AddPromo;
