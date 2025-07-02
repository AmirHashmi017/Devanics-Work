import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SupportTickets from './SupportTickets';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function SupportTicketTabs({ startDate, endDate }) {
    const [value, setValue] = React.useState(1);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab value={1} label="Active Tickets" />
                    <Tab value={0} label="Closed Tickets" />
                </Tabs>
            </Box>
            <CustomTabPanel value={0} index={0}>
                <SupportTickets status={value} startDate={startDate} endDate={endDate} />
            </CustomTabPanel>

        </Box>
    );
}
