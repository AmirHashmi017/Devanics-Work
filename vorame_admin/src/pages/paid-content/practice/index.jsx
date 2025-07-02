import React, { useState, useRef } from "react";
import Headbar from "./components/Headbar";
import { Box } from "@mui/material";
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
    <Box p={2} sx={{ overflowX: "hidden", overflowY: "auto" }}>
      <Headbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => setOpenAdd(true)}
      />
      <CustomDialog open={openAdd} onClose={() => setOpenAdd(false)} title="Add Concepts">
        <CreatePractice setOpen={setOpenAdd} onSuccess={handleRefetch} />
      </CustomDialog>
      <Box display="flex" flexWrap="wrap">
        <Practices
          searchTerm={searchTerm}
          setRefetch={ref => (practicesRef.current = ref)}
        />
      </Box>
    </Box>
  );
};

export default PracticeModule;
