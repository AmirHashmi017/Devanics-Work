import React, { useRef, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { downloadFileFromUrl } from 'utils'

const ReceiverMsg = ({ message, files = [], createdAt, postedBy,username }) => {
    const bubbleRef = useRef(null);
    useEffect(() => {
        if (bubbleRef.current) {
            console.log('Receiver bubble computed style:', getComputedStyle(bubbleRef.current));
        }
    }, [message]);
    if ((!message || message.trim() === "") && (!files || files.length === 0)) {
        return null;
    }
    return (
        <Box display='flex' flexDirection='column' alignItems='flex-start' gap={1}>
            {(message && message.trim() !== "") || (files && files.length > 0) ? (
                <Box display='flex' justifyContent='flex-start' alignItems='flex-end' gap={1}>
                    {/* Always use the user's avatar or default, never a message file */}
                    <Box
                        component='img'
                        src={postedBy.avatar && postedBy.avatar !== '' ? postedBy.avatar : '/icons/group.svg'}
                        alt='avatar'
                        width={32}
                        height={32}
                        borderRadius='50%'
                        sx={{ objectFit: 'cover' }}
                    />
                    <Box display='flex' flexDirection='column' gap={0.5}>
                        {/* Always render files (if any) */}
                        {files && files.length > 0 && (
                            <Box display='flex' flexWrap='wrap' gap={1} justifyContent='flex-end'>
                                {files.map(({ url, type, name }, i) => (
                                    type.includes('image') ? (
                                        <Box key={i} component='img' borderRadius={1} sx={{ objectFit: 'cover' }} width={80} height={80} src={url} />
                                    ) : (
                                        <Box key={i}>
                                            <Box className='cursor-pointer' onClick={() => downloadFileFromUrl(url, name)} component='img' src="/icons/file-yellow.svg" alt={name} width={80} height={80} />
                                            <Typography variant='body1'>{name}</Typography>
                                        </Box>
                                    )
                                ))}
                            </Box>
                        )}
                        {/* Always render the text bubble (if any) */}
                        {message && message.trim() !== "" && (
                            <Box
                                ref={bubbleRef}
                                width={308}
                                borderRadius='18px'
                                p={1.5}
                                boxShadow='none'
                                display='flex'
                                flexDirection='column'
                                gap={0.5}
                                sx={{}}
                                style={{ backgroundColor: '#F4F5F6', color: '#222', borderRadius: '18px', padding: '12px', boxShadow: 'none', width: 308 }}
                            >
                                <Typography variant='body1' sx={{ wordBreak: 'break-word', color: '#222' }}>
                                    {message}
                                </Typography>
                                <Typography variant='caption' sx={{ fontSize: 12, alignSelf: 'flex-start', mt: 0.5, color: '#98A2B3' }}>
                                    
                                    {moment(createdAt).startOf('hour').fromNow()}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            ) : null}
            {((message && message.trim() !== "") || (files && files.length > 0)) && username && (
                <Typography variant='caption' sx={{ color: '#98A2B3', fontSize: 12, mt: 0.5, ml: '40px', alignSelf: 'flex-start' }}>
                    {username}
                </Typography>
            )}
        </Box>
    )
}

export default ReceiverMsg
