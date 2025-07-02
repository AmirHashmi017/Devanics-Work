import React, { useEffect, useState } from 'react'
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import useApiMutation from 'hooks/useApiMutation';
import { SUPPORT_TICKET, SUPPORT_TICKET_STATUS } from 'services/constants';
import moment from 'moment';
import useApiQuery from "hooks/useApiQuery";
import Loader from "components/Loader";
import Error from "components/Error";
import useInvalidateQuery from 'hooks/useInvalidateQuery';

const MiniTicketDetails = ({ id }) => {

    const { mutate } = useApiMutation();
    const [status, setStatus] = useState(false);

    const invalidateQuery = useInvalidateQuery();
    const updateStatusHandler = (e) => {
        e.stopPropagation();
        setStatus(e.target.value)
        mutate({ url: SUPPORT_TICKET_STATUS + id }, {
            onSuccess: () => invalidateQuery([SUPPORT_TICKET + `chat-${id}`])
        });
    };

    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({
        queryKey: [SUPPORT_TICKET + `-${id}`, id], url: SUPPORT_TICKET + `/${id}`, otherOptions: {
            enabled: id ? true : false
        }
    });

    useEffect(() => {
        if (apiResponse) {
            setStatus(apiResponse.data.status);
        }
    }, [apiResponse])



    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    const ticketDetails = apiResponse ? apiResponse.data : {}

    const { category = '', subject = '', createdAt = '', postedBy } = ticketDetails;

    const { firstName = '', lastName = '' } = postedBy || {};
    return (
        <Box height='100%' borderLeft='1px solid #EAECEE'>
            <Box p='22px' borderBottom='1px solid #EAECEE'>
                <Typography variant='h6'>Ticket Details</Typography>
            </Box>
            <Box flex={1} display='flex' flexDirection='column' height='100%' pl={3} gap={4} pt={4}>
                <Box>
                    <Typography variant="body1" fontSize="10px" color="#858688">
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
                                <MenuItem value="">
                                    Select Status
                                </MenuItem>
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={0}>InActive</MenuItem>
                            </Select>
                        </Box>
                    </FormControl>
                </Box>

                <Box>
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
                </Box>
                <Box>
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
                </Box>
                <Box>
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
                </Box>
                <Box>
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
                </Box>
            </Box>
        </Box>
    )
}

export default MiniTicketDetails