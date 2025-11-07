import React, { useState } from 'react'
import Box from '@mui/material/Box';
import { MenuItem, Select, Typography, styled } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useApiQuery from 'hooks/useApiQuery';
import { DASHBOARD_STATS } from 'services/constants';
import Loader from 'components/Loader';
import Error from 'components/Error';
import DashboardComponents from './components';

// Custom styled Select component
const StyledSelect = styled(Select)(({ theme }) => ({
    minWidth: 88,
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    '& .MuiSelect-select': {
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#7C8091',
        display: 'flex',
        alignItems: 'center',
        '&:focus': {
            backgroundColor: 'transparent',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&:hover': {
        border: '1px solid #d0d0d0',
    },
    // '&.Mui-focused': {
    //     border: '1px solid #1976d2',
    //     boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    // },
    '& .MuiSelect-icon': {
        color: '#666666',
        fontSize: '20px',
    },
}));

// Custom styled MenuItem
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    fontSize: '14px',
    padding: '8px 12px',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
    '&.Mui-selected': {
        backgroundColor: '#e3f2fd',
        '&:hover': {
            backgroundColor: '#bbdefb',
        },
    },
}));

const Dashboard = () => {
    const [duration, setDuration] = useState('month'); // Set default to 'month'

    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({
        queryKey: [DASHBOARD_STATS, duration],
        url: DASHBOARD_STATS + (duration ? `/?duration=${duration}` : ''), otherOptions: { refetchOnWindowFocus: false }
    });

    const handleChange = (event) => {
        setDuration(event.target.value);
    };

    if (error) return <Error error={error} />
    if (isLoading) {
        return <Loader />
    }

    return (
        <div>
            <Box display='flex' justifyContent='space-between' marginX={2} alignItems='center' gap={2}>
                <Box>
                    <Typography variant='h3' fontWeight={600}>Dashboard</Typography>
                    <Typography variant="body1" color="#858688">
                        Welcome to the Dashboard
                    </Typography>
                </Box>
                <StyledSelect
                    value={duration}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    onChange={handleChange}
                    renderValue={(selected) => {
                        if (!selected) {
                            return (
                                <Typography
                                    sx={{
                                        color: '#999999',
                                        fontSize: '14px',
                                        fontWeight: 400
                                    }}
                                >
                                    Years
                                </Typography>
                            );
                        }
                        return selected === 'month' ? 'Monthly' : 'Yearly';
                    }}
                >
                    <StyledMenuItem value='month'>Monthly</StyledMenuItem>
                    <StyledMenuItem value='year'>Yearly</StyledMenuItem>
                </StyledSelect>
            </Box>
            <DashboardComponents apiResponse={apiResponse} duration={duration} />
        </div>
    )
}

export default Dashboard