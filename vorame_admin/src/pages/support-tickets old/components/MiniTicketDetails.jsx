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

    const { category = '', subject = '', createdAt = '', postedBy, message = '', files = [] } = ticketDetails;

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
                                <MenuItem value={1}>Open</MenuItem>
                                <MenuItem value={0}>Closed</MenuItem>
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
                            fontWeight={500}
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
                            fontWeight={500}
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
                            fontWeight={500}
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
                            fontWeight={500}
                        >
                            {moment(createdAt).format('LLL')}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="body1" fontSize="10px" color="#858688">
                        Message
                    </Typography>
                    <Box mt={1}>
                        <Typography
                            variant="body2"
                            color="#222222"
                            fontSize="12px"
                            fontWeight={400}
                        >
                            {(!message || message==="") ? 'N/A' : null} {message}
                        </Typography>
                        {files && files.length > 0 && (
                          <Box mt={2} display="flex" gap={2}>
                            {files.slice(0, 4).map((file, idx) => {
                              const isImage = file.type && file.type.startsWith('image/');
                              const isPdf = file.type === 'application/pdf';
                              
                              return (
                                <Box
                                  key={file._id || idx}
                                  sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    background: '#F4F4F4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isImage ? 'default' : 'pointer',
                                    '&:hover': {
                                      opacity: isImage ? 1 : 0.8,
                                    }
                                  }}
                                  onClick={!isImage ? () => window.open(file.url, '_blank') : undefined}
                                >
                                  {isImage ? (
                                    <img
                                      src={file.url}
                                      alt={file.name || 'attachment'}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#666',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        p: 1,
                                        height: '100%',
                                        width: '100%'
                                      }}
                                    >
                                      {isPdf ? (
                                        <>
                                          <Box
                                            component="img"
                                            src="/icons/file-yellow.svg"
                                            sx={{ width: 48, height: 48, mb: 1 }}
                                            alt="PDF"
                                          />
                                          <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 600, color: '#333', maxWidth: '100%', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word' }}>
                                            {file.name}
                                          </Typography>
                                        </>
                                      ) : (
                                        <>
                                          <Box
                                            component="img"
                                            src="/icons/file.svg"
                                            sx={{ width: 48, height: 48, mb: 1 }}
                                            alt="Document"
                                          />
                                          <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 600, color: '#333', maxWidth: '100%', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word' }}>
                                            {file.name}
                                          </Typography>
                                        </>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                            {Array.from({ length: 4 - files.length }).map((_, idx) => (
                              <Box
                                key={`empty-${idx}`}
                                sx={{
                                  width: 64,
                                  height: 64,
                                  borderRadius: 2,
                                  background: '#F4F4F4',
                                }}
                              />
                            ))}
                          </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default MiniTicketDetails