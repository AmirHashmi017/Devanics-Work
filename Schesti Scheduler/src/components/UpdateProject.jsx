import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    // Return in "YYYY-MM-DD" format
    return date.toISOString().split('T')[0];
}

const UpdateProject = ({ open, handleClose, project, handleUpdate, handleChange }) => {
    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: 700 }}>
                    <Typography variant="h6" component="h2">
                        <h1 className="s__09iii">Update Project</h1>
                    </Typography>

                    <div className="s__set__09w">
                        <h3 className="updateProject">Update Project Information</h3>
                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="Project ID"
                            name="projectId"
                            value={project?.projectId}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="Project Name"
                            name="projectName"
                            value={project?.projectName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="Owner"
                            name="owner"
                            value={project?.owner}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="Project Status"
                            name="projectStatus"
                            value={project?.projectStatus}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={formatDate(project?.startDate)} // Format the date
                            onChange={(e) => {
                                handleChange(e);
                                if (project.endDate) {
                                    const startDate = new Date(e.target.value);
                                    const endDate = new Date(project.endDate);
                                    const duration = endDate - startDate;
                                    const millisecondsInADay = 24 * 60 * 60 * 1000;
                                    const days = Math.max(0, duration / millisecondsInADay);
                                    handleChange({ target: { name: 'duration', value: days } });
                                }
                            }}
                            fullWidth
                            margin="normal"

                        />
                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={formatDate(project?.endDate)} // Format the date
                            onChange={(e) => {
                                handleChange(e);
                                const startDate = new Date(project?.startDate);
                                const endDate = new Date(e.target.value);
                                const duration = endDate - startDate;
                                const millisecondsInADay = 24 * 60 * 60 * 1000;
                                const days = Math.max(0, duration / millisecondsInADay);
                                handleChange({ target: { name: 'duration', value: days } });
                                handleChange({ target: { name: 'dueDate', value: e.target.value } });
                            }}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="Due Date"
                            name="dueDate"
                            type="date"
                            value={formatDate(project?.dueDate)} // Format the date
                            onChange={(e) => {
                                handleChange(e);
                                const startDate = new Date(project?.startDate);
                                const endDate = new Date(e.target.value);
                                const duration = endDate - startDate;
                                const millisecondsInADay = 24 * 60 * 60 * 1000;
                                const days = Math.max(0, duration / millisecondsInADay);
                                handleChange({ target: { name: 'duration', value: days } });
                                handleChange({ target: { name: 'endDate', value: e.target.value } });
                            }}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            hiddenLabel
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-hidden-label-normal"
                            label="Duration"
                            name="duration"
                            value={project?.duration}
                            onChange={(e) => {
                                const days = parseInt(e.target.value, 10);
                                const newStartDate = new Date(project?.startDate);
                                const newEndDate = new Date(newStartDate.getTime() + (days * 24 * 60 * 60 * 1000));
                                handleChange({ target: { name: 'endDate', value: newEndDate.toISOString().split('T')[0] } });
                                handleChange(e);
                            }}
                            fullWidth
                            margin="normal"
                        />
                        <div className="button__00999">
                            <Button
                                className="wclose"
                                onClick={handleClose}
                                variant="contained"
                                color="secondary"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                variant="contained"
                                color="primary"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default UpdateProject;
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};