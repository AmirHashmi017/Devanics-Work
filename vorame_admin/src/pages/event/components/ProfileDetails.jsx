import { Box, Stack, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { downloadFileFromUrl } from 'utils'

const ProfileDetails = ({ firstName, lastName, country, createdAt, files, criminalAct, financialProblem, closeDetails }) => {
    return (
        <Box maxWidth={496}>
            {/* Profile Detail */}
            <Box
                bgcolor="white"
                boxShadow="0px 0px 34px 0px #2632381F">
                <Box maxWidth='850px'>

                    <Box boxShadow='0px 0px 37px 0px #38425021' py={2} px={3}>
                        <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2} borderRadius={1}>
                            <Box py='10px' display='flex' gap={0.5} alignItems='center'>
                                <Box
                                    height='24px'
                                    width='24px'
                                    flexShrink={1}
                                    component="img"
                                    className='cursor-pointer'
                                    onClick={closeDetails}
                                    borderRadius="50%"
                                    src="/icons/back.svg"
                                    alt="back"
                                />
                                <Stack direction='row' alignItems='center' gap={1}>
                                    <Box
                                        height='32px'
                                        width='32px'
                                        flexShrink={1}
                                        component="img"
                                        borderRadius="50%"
                                        src="/icons/group.svg"
                                        alt={firstName}
                                    />
                                    <Typography variant="body1" fontSize="18px" color="#222222">
                                        {firstName} {lastName}
                                    </Typography>
                                </Stack>

                            </Box>
                            <Box
                                height='16px'
                                width='16px'
                                flexShrink={1}
                                component="img"
                                borderRadius="50%"
                                className='cursor-pointer'
                                onClick={closeDetails}
                                src="/icons/close.svg"
                                alt="close"
                            />
                        </Box>
                    </Box>
                    <Box p={3}>
                        <Box
                            gap={3}
                            position="relative"
                            mt={3}
                        >
                            <Box display="flex" gap="12px" alignItems="center">
                                <Box
                                    flexGrow={1}
                                    display="flex"
                                    flexWrap="wrap"
                                    alignItems="flex-start"
                                    justifyContent='space-between'
                                    gap="20px"
                                >
                                    <Box>
                                        <Typography variant="body1" fontSize="12px" color="#858688">
                                            First Name
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            mt={1}
                                            color="#222222"
                                            fontSize="16px"
                                            fontWeight={600}
                                        >
                                            {firstName}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" fontSize="12px" color="#858688">
                                            Last Name
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            mt={1}
                                            color="#222222"
                                            fontSize="16px"
                                            fontWeight={600}
                                        >
                                            {lastName}
                                        </Typography>
                                    </Box>

                                </Box>
                            </Box>
                            <Box mt={4}>
                                <Typography variant="body1" fontSize="12px" color="#858688">
                                    Country
                                </Typography>
                                <Typography
                                    variant="body2"
                                    mt={1}
                                    color="#222222"
                                    fontSize="16px"
                                    fontWeight={600}
                                >
                                    {country}
                                </Typography>
                            </Box>
                            <Box mt={4}>
                                <Typography variant="body1" fontSize="12px" color="#858688">
                                    Submission Date
                                </Typography>
                                <Typography
                                    variant="body2"
                                    mt={1}
                                    color="#222222"
                                    fontSize="16px"
                                    fontWeight={600}
                                >
                                    {moment(createdAt).format('DD-MM-YYYY')}
                                </Typography>
                            </Box>
                        </Box>
                        <Box mt={4}>
                            <Typography mt={1} variant="body1" fontSize="12px" color="#858688">
                                Please confirm if you need to make a disclosure in regards to any unspent criminal convictions or pending criminal investigations. This does not include fixed penalty notices for minor motoring offences.
                            </Typography>
                            <Typography
                                variant="body2"
                                mt={1}
                                color="#222222"
                                fontSize="16px"
                                fontWeight={600}
                            >
                                {criminalAct ? 'Yes' : 'No'}
                            </Typography>
                        </Box>
                        <Box mt={4}>
                            <Typography mt={1} variant="body1" fontSize="12px" color="#858688">
                                Please confirm if you need to disclose any personal financial difficulties you may be encountering or have encountered within the last six years. This includes details of any debt management plans and /or any missed payments, defaults, IVAs or CCJ's within the last six years, or bankruptcy within the last 10 years.
                            </Typography>
                            <Typography
                                variant="body2"
                                mt={1}
                                color="#222222"
                                fontSize="16px"
                                fontWeight={600}
                            >
                                {financialProblem ? 'Yes' : 'No'}
                            </Typography>
                        </Box>
                        {/* Resume Section */}
                        <Box mt={4}>
                            <Typography variant="body1" fontSize="12px" color="#858688">
                                CV
                            </Typography>
                            <Box mt={1} bgcolor='white' border='1px solid #EAECF0' display='flex' justifyContent='space-between' alignItems='center' gap={2} py={2} px={3} borderRadius={1}>
                                <Stack direction='row' alignItems='center' gap={1}>
                                    <Box
                                        height='45px'
                                        width='45px'
                                        flexShrink={1}
                                        p={1}
                                        component="img"
                                        bgcolor='#22222226'
                                        borderRadius="50%"
                                        border='1px solid #F4F4F4'
                                        src="/icons/file.svg"
                                        alt="file"
                                    />
                                    <Box>

                                        <Typography variant="body1" fontSize="14px" color="#344054">
                                            {files[0].name}
                                        </Typography>
                                        <Typography variant="body1" fontSize="14px" color="#667085">
                                            3.7 MB
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Box
                                    height='32px'
                                    width='32px'
                                    flexShrink={1}
                                    component="img"
                                    borderRadius="50%"
                                    src="/icons/download.svg"
                                    onClick={() => downloadFileFromUrl(files[0].url, files[0].name + `.${files[0].extension}`)}
                                    alt="download"
                                />
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ProfileDetails