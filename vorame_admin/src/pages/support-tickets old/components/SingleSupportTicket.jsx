import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import { SUPPORT_TICKET_KEY, SUPPORT_TICKET_STATUS } from "services/constants";
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from "moment";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

const SingleSupportTicket = (ticketData) => {
  const { _id, category, subject, status, createdAt ,postedBy} = ticketData;
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useApiMutation();

  // 3-dot menu state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event) => {
    event && event.stopPropagation();
    setAnchorEl(null);
  };
  const handleViewDetails = (event) => {
    event.stopPropagation();
    navigate(`/support-ticket/${_id}`, {
      state: {
        ticketOwner: {
          avatar: postedBy?.avatar,
          name: postedBy?.name,
          firstName: postedBy?.firstName,
          lastName: postedBy?.lastName,
        }
      }
    });
    setAnchorEl(null);
  };

  const fetchTickets = () => queryClient.invalidateQueries({ queryKey: SUPPORT_TICKET_KEY });

  const updateStatusHandler = (e) => {
    e.stopPropagation();
    mutate({ url: SUPPORT_TICKET_STATUS + _id }, {
      onSuccess: () => {
        fetchTickets();
      }
    });
  };

  const { firstName = '', lastName = '' } = ticketData?.postedBy || {};

  return (
    <Box
      gap={3}
      py={2}
      px={3}
      borderRadius="10px"
      bgcolor="white"
      className='cursor-pointer'
      boxShadow="0px 0px 34px 0px #2632381F"
      height="100%"
    >
      <Grid container
        flexGrow={1}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent='center'
        spacing="20px"
      >
        <Grid item md={2.4}>
          <Typography variant="body1" fontSize="10px" color="#858688">
            Category
          </Typography>
          <Box mt={1}>
            <Typography
              variant="body2"
              color="#606162"
              fontSize="14px"
              fontWeight={600}
            >
              {category}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2.4}>
          <Typography variant="body1" fontSize="10px" color="#858688">
            Subject
          </Typography>
          <Box mt={1}>
            <Typography
              variant="body2"
              color="#606162"
              fontSize="14px"
              fontWeight={600}
            >
              {subject}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2.4}>
          <Typography variant="body1" fontSize="10px" color="#858688">
            Username
          </Typography>
          <Box mt={1}>
            <Typography
              variant="body2"
              color="#606162"
              fontSize="14px"
              fontWeight={600}
            >
              {(!firstName && !lastName) ? 'N/A' : null} {firstName} {lastName}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2.4}>
          <Typography variant="body1" fontSize="10px" color="#858688">
            Date/Time Created
          </Typography>
          <Box mt={1}>
            <Typography
              variant="body2"
              color="#606162"
              fontSize="14px"
              fontWeight={600}
            >
              {moment(createdAt).format('LLL')}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2.4} display="flex" alignItems="center" justifyContent="space-between">
          <Stack maxWidth={300} direction='column' justifyContent='center' alignItems='center'>
            <Typography marginRight='50px' variant="body1" fontSize="10px" color="#858688">
              Status
            </Typography>
            <FormControl sx={{ mt: 0.5, minWidth: 120 }} size="small">
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Select
                  size="small"
                  value={status}
                  sx={{
                    borderRadius: '30px',
                  }}
                  onChange={updateStatusHandler}
                  placeholder="Status"
                >
                  <MenuItem value={status}>
                    Select Status
                  </MenuItem>
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>InActive</MenuItem>
                </Select>
              </Box>
            </FormControl>
          </Stack>
          {/* 3-dot menu for actions */}
          <Box>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
            </Menu>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SingleSupportTicket;
