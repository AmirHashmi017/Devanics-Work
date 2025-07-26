import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import Applicants from './Applicants'
import { CAREER, GET_CAREER } from '../../../services/constants';
import Loader from "components/Loader";
import Error from "components/Error";
import { useParams } from 'react-router-dom';
import useApiQuery from "hooks/useApiQuery";
import moment from 'moment';

const JobDetails = () => {
    const [showMore, setShowMore] = useState(false);
    const { id } = useParams();
    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({ queryKey: [CAREER, id], url: GET_CAREER + id });

    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    const { title, location, description, createdAt, lastDate } = apiResponse.data;

    return (
        <div>
            <Typography variant="body1" fontWeight={600} fontSize={24}>
                Job Details
            </Typography>
            {/* Job Detail Description */}
            <Box borderRadius="10px"
                bgcolor="white"
                boxShadow="none" border="1px solid #EAECEE" p={3} mt={3}>
                <Box maxWidth='850px'>
                    <Box
                        gap={3}
                        position="relative"
                    >
                        <Box display="flex" gap="12px" alignItems="center">
                            <Box
                                flexGrow={1}
                                display="flex"
                                flexWrap="wrap"
                                alignItems="flex-start"
                                justifyContent='space-between'
                                gap="20px"
                            >
                                <Box>
                                    <Typography variant="body1" fontSize="10px" color="#858688">
                                        Job Title:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        mt={1}
                                        color="#222222"
                                        fontSize="14px"
                                        fontWeight={600}
                                    >
                                        {title}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontSize="10px" color="#858688">
                                        Job Location:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        mt={1}
                                        color="#222222"
                                        fontSize="14px"
                                        fontWeight={600}
                                    >
                                        {location}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontSize="10px" color="#858688">
                                        Date Posted:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        mt={1}
                                        color="#222222"
                                        fontSize="14px"
                                        fontWeight={600}
                                    >
                                        {moment(createdAt).format('DD-MM-YYYY')}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontSize="10px" color="#858688">
                                        End Date:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        mt={1}
                                        color="#222222"
                                        fontSize="14px"
                                        fontWeight={600}
                                    >
                                        {moment(lastDate).format('DD-MM-YYYY')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box mt={4}>
                    <Typography variant="body1" fontSize="12px" color="#858688">
                        Subject
                    </Typography>
                    <Typography mt={1} variant="body1" fontSize="14px" color="#858688">
                        {description}
                        {/* <Button sx={{ bgcolor: 'transparent', textDecoartion: 'underline', color: 'black', fontWeight: 600, fontSize: '14px', textTransform: 'none', p: 0, ml: '4px' }}>
                            read more
                        </Button> */}
                    </Typography>
                </Box>
            </Box>
            {/* Applicants Section */}
            <Applicants />
        </div>
    )
}

export default JobDetails