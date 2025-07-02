import React, { useState } from 'react'
import { Grid, IconButton, Stack, Typography } from '@mui/material'
import { CustomBadge } from 'components'
import CustomDescriptionParser from 'components/DescriptionParser'
import { StyledCard } from 'theme/styles'
import FixedBox from 'components/FixedBox'

const SingeLibraryComponent = ({ _id, status, description, title, setStatus, setDialogOpen, setLibraryID, setOpenFormDialog, setDeleteID, setConfirmOpen, blog, expandedDescriptionId }) => {
    const [showDescription, setShowDescription] = useState(true);

    // Handle badge click
    const handleBadgeClick = (blog) => {
        setLibraryID(_id);
        setStatus(status);
        setDialogOpen(true);
    };

    // Open add library
    const handleClickOpen = (id) => {
        if (id) {
            setLibraryID(id);
        }
        setOpenFormDialog(true);
    };

    // Hanlde open delete confrim
    const handleConfirmOpen = (id) => {
        setDeleteID(id);
        setConfirmOpen(true);
    };


    return (
        <StyledCard sx={{
            padding: '10px',
            // border:"1px solid }"
            boxShadow: "none !important"
        }}>
            <Grid container>
                <Grid item xs={4}>
                    {/* Library title */}
                    <FixedBox height='30px'>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                            {title}
                        </Typography>
                    </FixedBox>
                </Grid>
                {/* Icos and badge  */}
                <Grid item xs={8} textAlign="right">
                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                    >
                        <div
                            style={{
                                marginRight: "35px",
                                marginTop: "5px",
                            }}
                        >
                            <CustomBadge
                                badgeContent={status}
                                onClick={() => handleBadgeClick(blog)}
                            />
                        </div>
                        <IconButton
                            aria-label="edit"
                            onClick={() => handleClickOpen(_id)}
                        >
                            <img src={`icons/edit.svg`} alt="edit" />
                        </IconButton>
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleConfirmOpen(_id)}
                        >
                            <img src={`icons/trash.svg`} alt="delete" />
                        </IconButton>
                        <IconButton
                            aria-label="expand"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            {showDescription ? (
                                <img
                                    src={`icons/chevron-down.svg`}
                                    alt="expand"
                                />
                            ) : (
                                <img
                                    src={`icons/chevron-up.svg`}
                                    alt="expand-up"
                                />
                            )}
                        </IconButton>
                    </Stack>
                </Grid>
            </Grid>
            {/* Custom description view in library */}
            <FixedBox height='80px'>
                {
                    showDescription && (
                        <CustomDescriptionParser
                            description={description}
                            expandedDescriptionId={expandedDescriptionId}
                            id={_id}
                            limit={2}
                        />

                    )
                }
            </FixedBox>

        </StyledCard>
    )
}

export default SingeLibraryComponent