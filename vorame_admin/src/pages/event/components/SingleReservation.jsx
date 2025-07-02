import React from 'react'
import { Box, Stack, Typography } from '@mui/material'

const SingleReservation = ({ reservedBy }) => {
    if (!reservedBy) {
        return null; // Or return a fallback UI if needed
    }

    const { _id, firstName, lastName } = reservedBy;

    return (
        <Box
            key={_id}
            bgcolor='#EAECEE'
            py='10px'
            borderRadius={1}
            px={2}
            display='flex'
            gap={2}
            justifyContent='space-between'
            alignItems='center'
            boxShadow="none !important"
        >
            <Stack direction='row' alignItems='center' gap={1}>
                <Box
                    height='36px'
                    width='36px'
                    flexShrink={1}
                    component="img"
                    borderRadius="50%"
                    src="/icons/group.svg"
                    alt="group"
                />
                <Typography variant="body1" fontSize="18px" color="#222222">
                    {firstName} {lastName}
                </Typography>
            </Stack>
        </Box>
    )
}

export default SingleReservation
