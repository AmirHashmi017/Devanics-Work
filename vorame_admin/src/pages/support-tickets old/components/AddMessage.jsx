import React, { useState } from 'react'
import { Box, CircularProgress, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import { CustomButton } from 'components'
import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { SUPPORT_TICKET } from 'services/constants';
import useApiMutation from 'hooks/useApiMutation';
import AwsS3 from 'utils/S3Intergration';
import { toast } from 'react-toastify';

const AddMessage = ({ status }) => {
    const { id } = useParams();
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const { mutate, isLoading } = useApiMutation({});
    const queryClient = useQueryClient();
    const fetchSingleChat = () =>
        queryClient.invalidateQueries({ queryKey: SUPPORT_TICKET + `chat-${id}` });

    const handleSubmit = async () => {

        const uploadedFileLinks = [];

        try {
            setLoading(true);
            for (let i = 0; i < files.length; i++) {
                const { type, name } = files[i];
                const url = await new AwsS3(files[i], "support/").getS3URL();
                uploadedFileLinks.push({
                    url,
                    type,
                    extension: type.split('/')[1],
                    name,
                })
            }

        } catch (error) {
            console.log('something went wrong', error);
            toast.error('Some error happended while uploading');

        } finally {
            setLoading(false)
        }

        if (value.trim().length < 1 && uploadedFileLinks.length < 1) {
            return
        }


        mutate(
            {
                url: SUPPORT_TICKET + `/message/${id}`,
                data: { message: value, files: uploadedFileLinks }
            }, {
            onSuccess: () => {
                fetchSingleChat();
                setValue("");
                setFiles([]);
            },
        }
        );
    }

    // handler to filter image or pdf
    const filterFiles = ({ type }) => type.includes('image') || type.includes('pdf');
    const disableChat = status ? false : true;

    return (
        <Box position='relative'>
            {
                files.length > 0 && (
                    <Box border='1px solid black' p={1} borderRadius={1} position='absolute' bottom={70} display='flex' gap={1} alignItems='center'>
                        {files.slice(0, 4).map((file, i) => file.type.includes('image') ? <Box key={i} position='relative'>
                            <Box>
                                {
                                    (files.length > 4 && i === 3) && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                color: 'white',
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            +{files.slice(4).length}
                                        </Box>
                                    )
                                }

                                <Box
                                    height='20px'
                                    width='20px'
                                    flexShrink={1}
                                    component="img"
                                    position='absolute'
                                    right={-4}
                                    top={-4}
                                    p={0.5}
                                    bgcolor='red'
                                    borderRadius="50%"
                                    className='cursor-pointer'
                                    onClick={() => setFiles(files => files.filter((_, fileIndex) => fileIndex !== i))}
                                    src="/icons/close.svg"
                                    alt="close"
                                />
                            </Box>
                            <Box component='img' borderRadius={1} sx={{ objectFit: 'cover' }} width={80} height={80} src={URL.createObjectURL(file)} />
                        </Box> : <Box key={i} component='img' src="/icons/file-yellow.svg" alt='file' width={80} height={80} />)}
                    </Box>
                )
            }

            <Box display='flex' gap={1} alignItems='center'>
                <Box disabled={disableChat} component='input' accept='application/pdf, image/*' multiple display='none' onChange={(e) => {
                    if (e.target.files.length > 0) {
                        const files = Array.from(e.target.files)
                        setFiles(files.filter(filterFiles))
                    }
                }} className='hidden' type="file" name="files" id="files" />
                <OutlinedInput disabled={disableChat} fullWidth
                    placeholder='Type your message'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type={'showPassword' ? 'text' : 'password'}
                    inputProps={{
                        style: {
                            height: '20px',
                        }
                    }}
                    endAdornment={
                        <IconButton disableRipple disabled={disableChat}>
                            <Box component='label' htmlFor='files'>
                                <InputAdornment position="end">
                                    <img className='cursor-pointer' src="/icons/select-file.svg" alt="send-arrow" />
                                </InputAdornment>
                            </Box>
                        </IconButton>
                    }
                />
                <CustomButton disableRipple disabled={disableChat} isLoading={false} onClick={handleSubmit} sx={{ py: 2 }}>
                    {
                        loading || isLoading ? (
                            <CircularProgress size="20px" disableShrink />
                        ) : (
                            <img src="/icons/send-arrow.svg" alt="send-arrow" />
                        )
                    }
                </CustomButton>
            </Box>
        </Box>
    )
}

export default AddMessage