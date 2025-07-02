import { Box } from '@mui/material'
import React from 'react'

const FixedBox = ({ height = 'auto', children, overflow = 'hidden' }) => {
    return (
        <Box height={height} overflow={overflow}>
            {children}
        </Box>
    )
}

export default FixedBox