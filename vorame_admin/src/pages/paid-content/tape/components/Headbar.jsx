import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { CustomButton } from "components";
import { Add } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CustomDialog from "components/Modal";
import CreateTap from "./CreateTap";

const Headbar = ({ searchTerm, setSearchTerm }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustomDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        title='Add Tranquility'
        maxWidth="md"
        fullWidth={true}
      >
        <CreateTap setOpen={setOpen} />
      </CustomDialog>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mt={4} // 32px top margin from header
        mb={3} // 24px bottom margin to content
      >
        <Typography variant="body1" fontWeight={600} fontSize={24}>
          Tranquility
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="stretch"
          gap={2}
        >
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

          <CustomButton
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add
          </CustomButton>
        </Box>
      </Box>
    </>
  );
};

export default Headbar;