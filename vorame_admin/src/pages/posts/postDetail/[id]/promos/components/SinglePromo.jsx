import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ConfirmDialog } from "components";
import CustomDialog from "components/Modal";
import CreatePromo from "./CreatePromo";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import useApiMutation from "hooks/useApiMutation";
import moment from "moment";
import { useQueryClient } from "react-query";
import { PROMO } from "services/constants";

const SinglePromo = (promoData) => {
  const { status = '' } = promoData || {};
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApiMutation();

  const { code, appliedTo, startDate, endDate } = promoData;
  const { price = '-', discount = '-' } = appliedTo || {};
  const fetchPromoList = () => queryClient.invalidateQueries({ queryKey: 'promos' });

  const handleDelete = () => {
    mutate({ method: 'delete', url: PROMO + `delete/${promoData._id}` }, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        fetchPromoList();
      }
    });
  };

  const updateStatusHandler = (status) => {
    mutate({ status });
  };

  return (
    <>
      <ConfirmDialog
        title="Delete Promo Code ?"
        dialogContext="Are you sure to delete promo ?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <CustomDialog
        title="Update Promo Code"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreatePromo promoData={promoData} setOpen={setOpenUpdateModal} />
      </CustomDialog>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        isLoading={false}
        status={status}
      />
      <Box
        gap={3}
        p={2}
        borderRadius="10px"
        bgcolor="white"
        boxShadow="0px 0px 34px 0px #2632381F"
        height="100%"
        position="relative"
      >
        <Box display="flex" gap="12px" alignItems="center">
          <Box
            p="14px"
            flexShrink={1}
            component="img"
            borderRadius="50%"
            bgcolor="#F4F7FA"
            src="/icons/tag.svg"
            alt="tag"
          />
          <Box
            flexGrow={1}
            display="flex"
            flexWrap="wrap"
            alignItems="flex-start"
            gap="20px"
          >
            <Box>
              <Typography variant="body1" fontSize="10px" color="#858688">
                Promo Code:
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                color="#222222"
                fontSize="14px"
                fontWeight={600}
              >
                {code}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" fontSize="10px" color="#858688">
                Discount:
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                color="#222222"
                fontSize="14px"
                fontWeight={600}
              >
                {discount ? `${discount}%` : 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" fontSize="10px" color="#858688">
                Plan Price:
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                color="#222222"
                fontSize="14px"
                fontWeight={600}
              >
                ${price}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" fontSize="10px" color="#858688">
                Start Date:
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                color="#222222"
                fontSize="14px"
                fontWeight={600}
              >
                {moment(startDate).format('MM-DD-YYYY')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" fontSize="10px" color="#858688">
                Expiry Date:
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                color="#222222"
                fontSize="14px"
                fontWeight={600}
              >
                {moment(endDate).format('MM-DD-YYYY')}
              </Typography>
            </Box>
            <Box
              position="absolute"
              right={10}
              top={10}
              display="flex"
              alignItems="center"
              gap="12px"
              mr="12px"
            >
              {/* <Box
                component="img"
                height="20px"
                width="20px"
                color="red"
                src="/icons/edit.svg"
                onClick={() => setOpenUpdateModal(true)}
                alt="edit"
              /> */}
              <Box
                component="img"
                height="20px"
                width="20px"
                className='cursor-pointer'
                onClick={() => setOpenDeleteModal(true)}
                src="/icons/trash.svg"
                alt="trash"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SinglePromo;
