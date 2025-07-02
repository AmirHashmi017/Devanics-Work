import React from 'react'
import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { downloadFileFromUrl } from 'utils'

const ReceiverMsg = ({ message, files, createdAt }) => {
    return (
        <Box display='flex' flexDirection='column' alignItems='flex-start' gap={1}>
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

                <Box
                    height='32px'
                    width='32px'
                    flexShrink={1}
                    component="img"
                    borderRadius="50%"
                    src="/icons/group.svg"
                    alt={'profile'}
                />
                <Box maxWidth={348} borderRadius='18px' p={1.5} bgcolor='#E9E9EB'>
                    <Typography color='#000000' variant='body1'>
                        {message}
                    </Typography>
                    <Typography color='#000000' variant='body2'>
                        {moment(createdAt).startOf('hour').fromNow()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default ReceiverMsg