import { Box } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import ReceiverMsg from './ReceiverMsg'
import SenderMsg from './SenderMsg'
import { SUPPORT_TICKET } from 'services/constants';
import { useParams } from 'react-router-dom';
import useApiQuery from "hooks/useApiQuery";
import Loader from "components/Loader";
import Error from "components/Error";
import localStorage from "../../../managers/auth";
import AddMessage from './AddMessage';
import NoData from 'components/NoData';

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

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [apiResponse]);

    const handleMessageSent = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };


    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    const ticketMessages = apiResponse ? apiResponse.data.messages : []

    

    return (
        <Box
            ref={chatContainerRef}
            height='56vh'
            overflow='auto'
            p={2}
            display='flex'
            flexDirection='column'
            gap={2}
        >
            {ticketMessages.length === 0 ? (
                <Box flex={1} display='flex' alignItems='center' justifyContent='center'>
                    <NoData message='No Messages Yet' />
                </Box>
            ) : (
                ticketMessages.map((messageData) => {
                    const { _id, postedBy } = messageData;
                    // If postedBy is missing, treat as sent by current user
                    const postedById = postedBy && postedBy._id ? postedBy._id : user._id;
                    const msg = messageData.message || messageData.text || messageData.content || "";
                    return (
                        postedById === user._id
                            ? <SenderMsg key={_id} message={msg} {...messageData} />
                            : <ReceiverMsg key={_id} message={msg} {...messageData} />
                    )
                })
            )}
        </Box>
    )
}

export default function ChatWithScroll(props) {
    return <Chat {...props} AddMessageComponent={AddMessage} />;
}