import { Box } from '@mui/material'
import React from 'react'
import Statistics from './Statistics';
import Earning from './Earning';
import WorldWide from './WorldWide';

const DashboardComponents = ({ apiResponse, duration }) => {

    const totalUsers = apiResponse ? apiResponse.data.totalUsers : 0;
    const paidUsers = apiResponse ? apiResponse.data.paidUsers : 0;
    const freeUsers = apiResponse ? apiResponse.data.freeUsers : 0;

    return (
        <Box>
            <Statistics duration={duration} statsData={apiResponse} />
            <Earning duration={duration} totalUsers={totalUsers} paidUsers={paidUsers} freeUsers={freeUsers} />
            <WorldWide duration={duration} />
        </Box>
    )
}

export default DashboardComponents