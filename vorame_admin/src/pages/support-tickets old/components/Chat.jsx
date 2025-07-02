import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import ReceiverMsg from './ReceiverMsg'
import SenderMsg from './SenderMsg'
import { SUPPORT_TICKET } from 'services/constants';
import { useParams } from 'react-router-dom';
import useApiQuery from "hooks/useApiQuery";
import Loader from "components/Loader";
import Error from "components/Error";
import localStorage from "../../../managers/auth";

const Chat = ({ setStatus }) => {

    const { id } = useParams();

    const user = localStorage.getUser();

    const {
        isLoading,
        error,
        data: apiResponse,
    } = useApiQuery({
        queryKey: [SUPPORT_TICKET + `chat-${id}`, id], url: SUPPORT_TICKET + `/chat/${id}`, otherOptions: {
            enabled: id ? true : false
        }
    });

    useEffect(() => {
        if (apiResponse) {
            setStatus(apiResponse.data.ticketStatus)
        }
    }, [apiResponse])



    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    const ticketMessages = apiResponse ? apiResponse.data.messages : []

    return (
        <Box height='62vh' overflow='auto' p={2} display='flex' flexDirection='column' gap={2}>
            {
                ticketMessages.map((messageData) => {
                    const { _id, postedBy } = messageData;
                    const { _id: postedById = "" } = postedBy || {};
                    return (
                        postedById === user._id ? <SenderMsg key={_id} {...messageData} /> : (
                            <ReceiverMsg key={_id} {...messageData} />
                        )
                    )
                })
            }
        </Box>
    )
}

export default Chat