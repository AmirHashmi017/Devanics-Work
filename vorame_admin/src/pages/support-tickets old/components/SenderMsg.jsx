import React, { useRef, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { downloadFileFromUrl } from 'utils'

const SenderMsg = ({ message, files = [], createdAt }) => {
    const bubbleRef = useRef(null);
    useEffect(() => {
        if (bubbleRef.current) {
            console.log('Sender bubble computed style:', getComputedStyle(bubbleRef.current));
        }
    }, [message]);
    if ((!message || message.trim() === "") && (!files || files.length === 0)) {
        return null;
    }
    return (
        <Box display='flex' flexDirection='column' gap={1} alignItems='flex-end' justifyContent='flex-end'>
            {/* Render files if present */}
            {files.length > 0 && (
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
            {message && message.trim() !== "" && (
                <Box display='flex' justifyContent='flex-end' alignItems='flex-end' gap={1}>
                    <Box
                        ref={bubbleRef}
                        width={348}
                        borderRadius='18px'
                        p={1.5}
                        boxShadow='none'
                        display='flex'
                        flexDirection='column'
                        gap={0.5}
                        sx={{}}
                        style={{ backgroundColor: '#222', color: '#fff', borderRadius: '18px', padding: '12px', boxShadow: 'none', width: 348 }}
                    >
                        <Typography variant='body1' sx={{ wordBreak: 'break-word', color: '#fff' }}>
                            {message}
                        </Typography>
                        <Typography variant='caption' sx={{ fontSize: 12, alignSelf: 'flex-end', mt: 0.5, color: '#98A2B3' }}>
                            {moment(createdAt).fromNow()}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default SenderMsg