import React from 'react'
import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { downloadFileFromUrl } from 'utils'

const SenderMsg = ({ message, files, createdAt }) => {
    return (
        <Box display='flex' flexDirection='column' gap={1} alignItems='flex-end' justifyContent='flex-end'>
            {
                files.length > 0 && (
                    <Box display='flex' flexWrap='wrap' gap={1} justifyContent='flex-end'>
                        {
                            files.map(({ url, type, name }, i) => (
                                type.includes('image') ? <Box key={i} component='img' borderRadius={1} sx={{ objectFit: 'cover' }} width={80} height={80} src={url} />
                                    : (
                                        <Box>
                                            <Box className='cursor-pointer' key={i} onClick={() => downloadFileFromUrl(url, name)} component='img' src="/icons/file-yellow.svg" alt={name} width={80} height={80} />
                                            <Typography variant='body1'>{name}</Typography>
                                        </Box>
                                    )))
                        }
                    </Box>
                )
            }
            <Box display='flex' justifyContent='center' alignItems='flex-end'>
                <Box maxWidth={348} borderRadius='18px' p={1.5} bgcolor='#222222'>
                    <Typography color='#FFFFFF' variant='body1'>
                        {message}
                    </Typography>
                    <Typography color='#FFFFFF' variant='body2'>
                        {moment(createdAt).startOf('hour').fromNow()}
                    </Typography>
                </Box>
                <Box
                    height='32px'
                    width='32px'
                    flexShrink={1}
                    component="img"
                    borderRadius="50%"
                    src="/icons/group.svg"
                    alt='profile'
                />
            </Box>
        </Box>
    )
}

export default SenderMsg