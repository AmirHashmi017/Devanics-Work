import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ConfirmDialog } from "components";
import CustomDialog from "components/Modal";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import { EVENT } from "services/constants";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CreateEvent from "./CreateEvent";

const SingleEvent = (eventData) => {
  const { _id,  date, time, duration, description, reservations, start_url } = eventData;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApiMutation();

  const fetchEventList = () => queryClient.invalidateQueries({ queryKey: 'events' });

  const handleDelete = () => {
    mutate({ method: 'delete', url: EVENT + `/${_id}` }, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        fetchEventList();
      }
    });
  };

  const updateStatusHandler = (status) => {
    mutate({ method: 'patch', url: EVENT, data: { status } });
  };

  // today date in moment format
  const today = moment().startOf('day');

const checkEventStatus = () => {
  const today = moment(); 
  const eventDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm"); 

  const eventEndTime = moment(eventDateTime).add(duration, "minutes");

  if (today.isSame(eventDateTime, "day")) {
    if (today.isBetween(eventDateTime, eventEndTime)) {
      return "today"; 
    } else if (today.isBefore(eventDateTime)) {
      return "upcoming"; 
    } else {
      return "completed"; 
    }
  } else if (eventDateTime.isAfter(today, "day")) {
    return "upcoming"; 
  } else {
    return "completed"; 
  }
};


  const eventStatus = checkEventStatus();
  const daysLeft = moment(date).diff(moment(today), 'days');

  const getStatusConfig = () => {
    switch (eventStatus) {
      case 'today':
        return {
          label: 'Today',
          backgroundColor: ' #E5CB33 !important',
          color: '#222222',
          border: '1px solid #FFE69C'
        };
      case 'upcoming':
        return {
          label: 'Upcoming',
          backgroundColor: '#EAECEE !important',
          color: '#222222',
          border: '1px solid #CED4DA'
        };
      case 'completed':
        return {
          label: 'Completed',
          backgroundColor: '#2E8852 !important',
          color: '#FFFFFF',
          border: '1px solid #A3CFBB'
        };
      default:
        return {
          label: 'Unknown',
          backgroundColor: '#F8F9FA',
          color: '#495057',
          border: '1px solid #DEE2E6'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleCardClick = () => {
    navigate(`/event/${_id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setOpenUpdateModal(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDeleteModal(true);
  };

  const handleJoinEvent = (e) => {
    if(start_url)
    {
    window.open(start_url, "_blank");
    }
    e.stopPropagation();
    // Add join event logic here
    console.log('Join event clicked');
  };

  const handleReplay = (e) => {
    e.stopPropagation();
    // Add replay logic here
    console.log('Replay clicked');
  };

  return (
    <>
      <ConfirmDialog
        title="Delete Event"
        dialogContext="Are you sure to delete event ?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <CustomDialog
        title="Update Event"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreateEvent eventData={eventData} setOpen={setOpenUpdateModal} />
      </CustomDialog>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        isLoading={false}
        status='inactive'
      />
      
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '1px solid #E5E7EB'
        }}
        onClick={handleCardClick}
      >
        {/* Header with Title and Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: "12px" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '18px',
                color: '#1F2937',
                lineHeight: 1.3
              }}
            >
              {eventData.eventName}
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'none',
                backgroundColor: statusConfig.backgroundColor,
                color: statusConfig.color,
                border: statusConfig.border
              }}
            >
              {statusConfig.label}
            </Box>
          </Box>
          
          {/* Action Icons */}
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <Box
              component="img"
              src="/icons/edit.svg"
              alt="edit"
              sx={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                opacity: 0.7,
                '&:hover': { opacity: 1 }
              }}
              onClick={handleEditClick}
            />
            <Box
              component="img"
              src="/icons/trash.svg"
              alt="delete"
              sx={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                opacity: 0.7,
                '&:hover': { opacity: 1 }
              }}
              onClick={handleDeleteClick}
            />
          </Box>
        </Box>

        {/* Date and Time */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: 500,
              mb: 0.5
            }}
          >
            Date: {moment(date).format('dddd Do MMMM YYYY')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Time: {moment(time, 'HH:mm').format('h:mm A (GMT)')}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#6B7280',
            fontSize: '14px',
            lineHeight: 1.5,
            mb: 3,
            flex: 1
          }}
        >
          {description }
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box
            component="img"
            src="/icons/reservation.svg"
            alt="reservations"
            sx={{ width: 16, height: 16 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#1F2937',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {reservations || 0} Reservations
          </Typography>
        </Box>

        {/* Action Button */}
        <Box sx={{ mt: 'auto' }}>
          {eventStatus === 'today' && (
            <Button
              fullWidth
              variant="contained"
              onClick={handleJoinEvent}
              sx={{
                backgroundColor: '#1F2937',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'none',
                borderRadius: '20px',
                py: '5px',
                '&:hover': {
                  backgroundColor: '#374151'
                }
              }}
            >
              Join Event
            </Button>
          )}
          
          {eventStatus === 'upcoming' && daysLeft > 0 && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <Box
                  component="img"
                  src="/icons/clock.svg"
                  alt="clock"
                  sx={{ width: 16, height: 16 }}
                />
              }
              sx={{
                color: '#6B7280',
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
                fontWeight: 500,
                fontSize: '14px',
                textTransform: 'none',
                borderRadius: '20px',
                py: '5px',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                  borderColor: '#9CA3AF'
                }
              }}
            >
              {daysLeft} Days Left
            </Button>
          )}
          
          {eventStatus === 'completed' && (
            <Button
              fullWidth
              variant="contained"
              onClick={handleReplay}
              sx={{
                backgroundColor: '#1F2937',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'none',
                borderRadius: '20px',
                py: '5px',
                '&:hover': {
                  backgroundColor: '#374151'
                }
              }}
            >
              Replay
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SingleEvent;