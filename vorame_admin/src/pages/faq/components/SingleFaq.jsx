import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ConfirmDialog } from "components";
import { useQueryClient } from "react-query";
import { FAQ } from "services/constants";
import { toast } from "react-toastify";
import CustomDialog from "components/Modal";
import CreateFaq from "./CreateFaq";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useApiMutation from "hooks/useApiMutation";

const SingleFaq = ({ dragHandleProps, ...faqData }) => {
  const { _id, question, description, status } = faqData;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const queryClient = useQueryClient();

  const fetchFaqList = () =>
    queryClient.invalidateQueries({ queryKey: "faqs" });
  const { mutate, isLoading } = useApiMutation();

  const handleSuccess = (message) => {
    toast.success(message);
    fetchFaqList();
  };

  const handleDelete = () => {
    mutate(
      { method: "delete", url: FAQ + `delete/${_id}` },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenDeleteModal(false);
        },
      }
    );
  };

  const updateStatusHandler = (status) => {
    mutate(
      { url: FAQ + "update-status", data: { status, id: _id } },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenStatusModal(false);
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog
        title="Delete Faq?"
        dialogContext="Are you sure to delete Faq ?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <CustomDialog
        title="Update Faq"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreateFaq faqData={faqData} setOpen={setOpenUpdateModal} />
      </CustomDialog>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        isLoading={isLoading}
        status={status}
      />
      <Accordion
        sx={{
          bgcolor: "white",
          boxShadow: "none !important",
          border: "1px solid #EAECEE",
          px: 2,
          py: "10px",
          borderRadius: "12px !important",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Box
            display="flex"
            width={1}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box display="flex" alignItems="center" gap={1} {...dragHandleProps}>
              <Box
                component="img"
                src="/icons/dots-grid.svg"
                alt="drag"
                sx={{ width: 18, height: 18, cursor: "grab" }}
              />
              <Typography sx={{ fontSize: "20px", fontWeight: 500 }} color="#222222">
                {question}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap="12px"
              mr="12px"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Button
                onClick={() => setOpenStatusModal(true)}
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#2E8852",
                  borderRadius: "17px",
                  color: "white",
                  fontWeight: 400,
                  py: "1px",
                  px: "6px",
                }}
              >
                {status}
              </Button>
              <Box
                component="img"
                height="20px"
                width="20px"
                color="red"
                src="/icons/edit.svg"
                onClick={() => setOpenUpdateModal(true)}
                alt="edit"
              />
              <Box
                component="img"
                height="20px"
                width="20px"
                onClick={() => setOpenDeleteModal(true)}
                src="/icons/trash.svg"
                alt="trash"
              />
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default SingleFaq;
