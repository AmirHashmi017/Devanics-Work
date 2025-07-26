import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ConfirmDialog } from "components";
import { useQueryClient } from "react-query";
import { PLAN } from "services/constants";
import { toast } from "react-toastify";
import CustomDialog from "components/Modal";
import CreatePlan from "./CreatePlan";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import useApiMutation from "hooks/useApiMutation";

const Plan = (planData) => {
  const {
    _id,
    semiAnually,
    duration,
    name,
    descripiton,
    discount,
    status,
    price,
  } = planData;
  const queryClient = useQueryClient();
  const [discountOffer, setDiscountOffer] = useState("");
  const [discountPrice, setDiscountPrice] = useState(price);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [trashIconIndex, setTrashIconIndex] = useState(0);
  const [editIconIndex, setEditIconIndex] = useState(0);
  const editIcon = ["/icons/edit.svg", "/icons/edit-01.svg"];
  const trashIcon = ["/icons/trash.svg", "/icons/trash-01.svg"];
  const { mutate, isLoading } = useApiMutation();

  const fetchPlanList = () =>
    queryClient.invalidateQueries({ queryKey: "plans" });
  const handleSuccess = (message) => {
    toast.success(message);
    fetchPlanList();
  };

  const handleDelete = () => {
    mutate(
      { method: "delete", url: PLAN + `delete/${_id}` },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenDeleteModal(false);
        },
      },
    );
  };

  const updateStatusHandler = (status) => {
    mutate(
      { method: "put", url: PLAN + `status/${_id}`, data: { status } },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenStatusModal(false);
        },
      },
    );
  };

  useEffect(() => {
  if (duration == 12) {
    setDiscountOffer("7-Day Free Trial");
  } else if (discount) {
    // Round discount to 2 decimals for display
    const roundedDiscount = Number(Number(discount).toFixed(2));
    setDiscountOffer(`Save ${roundedDiscount}%`);
    setDiscountPrice(Number((price - (price * roundedDiscount) / 100).toFixed(2)));
  } else if (discount && semiAnually) {
    setDiscountOffer("");
  } else {
    setDiscountOffer("");
  }
}, [planData]);

  useEffect(() => {
    if (discount) {
      setDiscountPrice(Number((price - (price * discount) / 100).toFixed(2)));
    } else {
      setDiscountPrice(Number(Number(price).toFixed(2)));
    }
  }, [price, discount]);

  return (
    <>
      <ConfirmDialog
        title="Delete Plan ?"
        dialogContext="Are you sure to delete plan ?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <CustomDialog
        title="Update Plan"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreatePlan planData={planData} setOpen={setOpenUpdateModal} />
      </CustomDialog>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        isLoading={isLoading}
        status={status}
      />
      <Box
        gap={3}
        p={3}
        position="relative"
        borderRadius="10px"
        bgcolor="white"
        boxShadow="0px 0px 34px 0px #2632381F"
        height="100%"
        onMouseOver={() => {
          setTrashIconIndex(1);
          setEditIconIndex(1);
        }}
        onMouseLeave={() => {
          setTrashIconIndex(0);
          setEditIconIndex(0);
        }}
        sx={{
          ":hover": {
            bgcolor: "#222222",
            color: "white",
            cursor: "pointer",
          },
        }}
      >
        <Typography variant="h6" fontWeight={500} fontSize="20px">
          {name}
        </Typography>
        <Typography mt="12px" fontSize="14px">
          {descripiton}
        </Typography>
        <Typography mt="6px" fontSize="14px">
          £{discountPrice} charged once
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
          alignItems="center"
        >
          <Button
            sx={{
              textTransform: "capitalize",
              bgcolor: "#2E8852",
              borderRadius: "17px",
              color: "white",
              fontWeight: 400,
              py: "1px",
              px: "6px",
              fontSize: "12px",
            }}
            onClick={() => setOpenStatusModal(true)}
          >
            {status}
          </Button>

          <Box display="flex" gap={2}>
            <Box
              component="img"
              height="20px"
              width="20px"
              color="red"
              src={editIcon[editIconIndex]}
              onClick={() => setOpenUpdateModal(true)}
              alt="edit"
            />
            <Box
              component="img"
              height="20px"
              width="20px"
              onClick={() => setOpenDeleteModal(true)}
              src={trashIcon[trashIconIndex]}
              alt="trash"
            />
          </Box>
        </Box>
        {discountOffer && (
          <Box
            position="absolute"
            top="-6%"
            right="6%"
            bgcolor="white"
            border="1px solid black"
            borderRadius="10px"
            boxShadow="0px 4px 48px 0px #0000000A"
            px={1}
          >
            <Typography
              bgcolor="white"
              variant="body2"
              fontWeight={500}
              color="black"
            >
              {discountOffer}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Plan;
