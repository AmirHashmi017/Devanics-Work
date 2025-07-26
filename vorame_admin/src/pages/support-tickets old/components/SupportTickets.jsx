import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Loader from "components/Loader";
import NoData from "components/NoData";
import useApiQuery from "hooks/useApiQuery";
import useApiMutation from "hooks/useApiMutation";
import { SUPPORT_TICKET_LIST, SUPPORT_TICKET_STATUS } from "services/constants";
import { Box, Pagination, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

const PAGE_SIZE = 10;

const SupportTickets = ({ startDate, endDate }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuTicketId, setMenuTicketId] = useState(null);
    const navigate = useNavigate();
    const startD = startDate ? dayjs(startDate).format('MM-DD-YYYY') : null;
    const endD = endDate ? dayjs(endDate).format('MM-DD-YYYY') : null;
    const offset = (page - 1) * PAGE_SIZE;
    const [ticketsState, setTicketsState] = useState([]);

    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({
        queryKey: ["support-tickets-old", searchTerm, startDate, endDate, page],
        url: SUPPORT_TICKET_LIST + `?searchTerm=${searchTerm}&offset=${offset}&limit=${PAGE_SIZE}${endD ? `&startDate=${startD}` : ''}${endD ? `&endDate=${endD}` : ''}`
    });

    React.useEffect(() => {
        setTicketsState(apiResponse?.data?.tickets || []);
    }, [apiResponse]);

    const { mutate } = useApiMutation();

    const handleStatusChange = (ticketId, newStatus) => {
        // Optimistically update UI
        setTicketsState(prev => prev.map(ticket => ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket));
        mutate(
            { url: SUPPORT_TICKET_STATUS + ticketId, data: { status: newStatus }, method: 'post' },
            {
                // No need to update state again on success, already done optimistically
            }
        );
    };

    const handleMenuOpen = (event, ticketId) => {
        setAnchorEl(event.currentTarget);
        setMenuTicketId(ticketId);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuTicketId(null);
    };
    const handleViewDetails = (ticketId) => {
        navigate(`/support-ticket/${ticketId}`);
        handleMenuClose();
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;

    const tickets = ticketsState;
    const total = apiResponse?.data?.total || 0;

    return (
        <Box>
            <Box mt={4} mb={2}>
                <Typography sx={{ fontSize: '24px', fontWeight: 600, ml: 0 }}>Support</Typography>
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "none !important", border: "1px solid #ECECEC" }}>
                <Table sx={{ minWidth: 850, border: "1px solid #ECECEC", borderRadius: "12px !important", overflowX: 'auto', shadow: "none !important" }}>
                    <TableHead sx={{ bgcolor: "#F4F7FA", }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 400, fontSize: "14px", p: 1.3 }} align="left">Subject</TableCell>
                            <TableCell sx={{ fontWeight: 400, p: 1.3 }} align="left">Category</TableCell>
                            <TableCell sx={{ fontWeight: 400, p: 1.3 }} align="left">Username</TableCell>
                            <TableCell sx={{ fontWeight: 400, p: 1.3 }} align="left">Created Date</TableCell>
                            <TableCell sx={{ fontWeight: 400, p: 1.3 }} align="center">Status</TableCell>
                            <TableCell sx={{ fontWeight: 400, p: 1.3 }} align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.length > 0 ? tickets.map((ticket) => (
                            <TableRow key={ticket._id}>
                                <TableCell align="left">{ticket.subject || '-'}</TableCell>
                                <TableCell align="left">{ticket.category || '-'}</TableCell>
                                <TableCell align="left">{ticket.postedBy?.firstName || ''} {ticket.postedBy?.lastName || ticket.postedBy?.name || '-'}</TableCell>
                                <TableCell align="left">{ticket.createdAt ? dayjs(ticket.createdAt).format('DD-MM-YYYY') : '-'}</TableCell>
                                <TableCell align="center">
                                    <FormControl size="small">
                                        <Select
                                            value={ticket.status}
                                            onChange={e => handleStatusChange(ticket._id, e.target.value)}
                                            sx={{ borderRadius: '30px', minWidth: 100 }}
                                        >
                                            <MenuItem value={1}>Open</MenuItem>
                                            <MenuItem value={0}>Closed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={e => handleMenuOpen(e, ticket._id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={menuTicketId === ticket._id}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem onClick={() => handleViewDetails(ticket._id)}>View Details</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6}><NoData /></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {total > PAGE_SIZE && (
                <Box width={1} mt="20px" display="flex" justifyContent="center">
                    <Pagination
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        count={Math.ceil(total / PAGE_SIZE)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default SupportTickets;
