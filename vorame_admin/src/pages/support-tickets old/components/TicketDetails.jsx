import React, { useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import Chat from './Chat';
import MsgDetails from './MiniTicketDetails';
import AddMessage from './AddMessage';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import localStorage from "../../../managers/auth";
import useApiQuery from "hooks/useApiQuery";
import { SUPPORT_TICKET } from 'services/constants';

const TicketDetails = () => {
    const location = useLocation();
    console.log(location.state)
    const { id } = useParams();
    const navigate = useNavigate();

    // Try to get ticketOwner from state
    let ticketOwner = location.state?.ticketOwner;

    // Fallback: fetch ticket details from API if ticketOwner is not in state
    const { data: apiResponse } = useApiQuery({
        queryKey: [SUPPORT_TICKET + `-owner-${id}`, id],
        url: SUPPORT_TICKET + `/${id}`,
        otherOptions: { enabled: !ticketOwner && !!id }
    });
    if (!ticketOwner && apiResponse) {
        ticketOwner = apiResponse.data?.postedBy;
    }

    const [status, setStatus] = useState(0);

    return (
        <Grid container bgcolor='white' height='82.8vh' overflow='hidden' border='1px solid #EAECEE' borderRadius={2}>
            <Grid lg={8} item>
                <Box height='100%'>
                    <Box borderBottom='1px solid #EAECEE' width='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2} borderRadius={1}>
                        <Box p='20px' width='100%' display='flex' gap={2} alignItems='center'>
                            <Box
                                height='24px'
                                width='24px'
                                flexShrink={1}
                                component="img"
                                className='cursor-pointer'
                                onClick={() => navigate('/support-tickets')}
                                borderRadius="50%"
                                src="/icons/back.svg"
                                alt="back"
                            />
                            <Stack direction='row' alignItems='center' gap={1}>
                                <Box
                                    height='32px'
                                    width='32px'
                                    flexShrink={1}
                                    component="img"
                                    borderRadius="50%"
                                    src={ticketOwner?.avatar || '/icons/group.svg'}
                                    alt={'profile'}
                                />
                                <Typography variant="body1" fontSize="18px" color="#222222">
                                    {ticketOwner?.name || ticketOwner?.firstName || ''}
                                </Typography>
                            </Stack>
                        </Box>

                    </Box>
                    {/* chat messages */}
                    <Chat setStatus={setStatus} ticketOwner={ticketOwner} />
                    {/* add new message input */}
                    <Box mt='auto' p={2}>
                        <AddMessage status={status} />
                    </Box>
                </Box>
            </Grid>
            {
                id && (
                    <Grid lg={4} item>
                        <MsgDetails id={id} />
                    </Grid>
                )
            }

        </Grid>

    )
}

export default TicketDetails