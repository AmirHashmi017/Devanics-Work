import React from "react";
import { Stack } from "@mui/material";
import NoData from "components/NoData";
import useApiQuery from "hooks/useApiQuery";
import { SUPPORT_TICKETS, SUPPORT_TICKET_LIST } from "services/constants";
import SingleSupportTicket from "./SingleSupportTicket";
import Loader from "components/Loader";
import Error from "components/Error";
import dayjs from "dayjs";

const SupportTickets = ({ status, startDate, endDate }) => {
    const startD = startDate ? dayjs(startDate).format('MM-DD-YYYY') : null;
    const endD = endDate ? dayjs(endDate).format('MM-DD-YYYY') : null;
    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({ queryKey: [SUPPORT_TICKETS, status, startDate, endDate], url: SUPPORT_TICKET_LIST + `?status=${status}${endD ? `&startDate=${startD}` : ''}${endD ? `&endDate=${endD}` : ''}` });

    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    return (
        <div>
            {apiResponse &&
                (apiResponse.data.tickets.length > 0 ? (
                    <Stack direction='column' gap={1.5}>
                        {
                            apiResponse.data.tickets.map((ticketData, i) => (
                                <SingleSupportTicket {...ticketData} key={ticketData.id} />
                            ))
                        }
                    </Stack>

                ) : (
                    <NoData />
                ))}
        </div>
    );
};

export default SupportTickets;
