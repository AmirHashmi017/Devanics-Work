import React, { useState } from 'react'
import { Box, Button, Drawer, Stack, Typography } from '@mui/material'
import ProfileDetails from './ProfileDetails';

const SingleApplicant = (applicantData) => {
    const [openDetails, setOpenDetails] = useState(false);
    const { _id, firstName, lastName } = applicantData;
    return (
        <>
            <Drawer
                anchor='right'
                open={openDetails}
                onClose={setOpenDetails}
            >
                <Box maxWidth={500} width='100%'>
                    <ProfileDetails {...applicantData} closeDetails={() => setOpenDetails(false)} />
                </Box>
            </Drawer>
            <Box 
                key={_id} 
                bgcolor='white' 
                py='10px' 
                borderRadius={1} 
                px={2} 
                display='flex' 
                gap={2} 
                justifyContent='space-between' 
                alignItems='center'
                border="1px solid #EAECEE"
                boxShadow="none"
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
                <Button onClick={() => setOpenDetails(true)} sx={{ bgcolor: 'transparent', textDecoartion: 'underline', color: 'black', textDecoration: 'underline', fontWeight: 500, fontSize: '14px' }}>
                    View Details
                </Button>
            </Box>
        </>
    )
}

export default SingleApplicant