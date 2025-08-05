import React, { useEffect, useState } from "react";
import Header from "../Header";
import Leftsidebar from "../Leftsidebar";
import { useTable } from "react-table";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Icon from "../../images/Icon.png"
import edit from "../../images/edit.png"
import view from "../../images/view.png"
import {
    Modal,
    Box,
    Button,
    TextField,
    Typography,
    Select,
    MenuItem,
    Menu,
    Fade,
    InputAdornment,
    FormControl,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { backend_url } from "../../constants/api";

function FadeMenu({ handleOpen, setProject, projectData, handleDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        setProject(projectData); // Set the specific project data
        handleOpen(); // Open the modal
        handleClose(); // Close the menu
    };
    return (
        <div>
            <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <img src={Icon} />
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuItem onClick={handleEditClick}>
                    <div className="d-flex gap-2" style={{ color: "#007AB6" }}>
                        <img src={edit} />
                        <div>Edit</div>
                    </div>
                </MenuItem>
                <MenuItem onClick={() => handleDelete(projectData)}>
                    <div className="d-flex gap-2" style={{ color: "#007AB6" }}>
                        <img src={view} />
                        <div>Delete</div>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default function Resources() {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState({
        Name: "",
        Type: "",
    });
    const [userId, setUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRole({ ...role, [name]: value });
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.patch(backend_url+`/resource/${role._id}`, {
                    userId,
                    Name: role.Name,
                    Type: role.Type,
                });
            } else {
                await axios.post(backend_url+"/resource", {
                    userId,
                    Name: role.Name,
                    Type: role.Type,
                });
            }
            handleClose();
            fetchRoles(); // Refresh roles list after save
        } catch (error) {
            console.error(
                `Error ${isEditing ? "updating" : "creating"} role:`,
                error
            );
        }
    };

    useEffect(() => {
        if (userId) fetchRoles();
    }, [userId]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) setUserId(user._id);
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                backend_url+`/resource/${userId}`
            );
            setRoles(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching resource:", error);
        }
    };
    const handleDelete = async (projectData) => {

        try {
            setLoading(true);
            const response = await axios.delete(
                backend_url+`/resource/${projectData?._id}`
            );
            fetchRoles()

        } catch (error) {
            console.error("Error fetching resource:", error);
        }

    }
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRoles = React.useMemo(
        () =>
            roles?.filter((role) =>
                role?.Name?.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [roles, searchQuery]
    );
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const columns = React.useMemo(
        () => [
            {
                Header: "#",
                accessor: "key",
            },
            {
                Header: "Resource Name",
                accessor: "Name",
            },
            {
                Header: "Resource Type",
                accessor: "Type",
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <FadeMenu
                        handleOpen={() => {
                            setIsEditing(true);
                            handleOpen();
                        }}
                        setProject={setRole}
                        projectData={row.original}
                        handleDelete={handleDelete}
                    />
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: filteredRoles });

    return (
        <>
            <Header />
            <div className="mainpage">
                <div className="row">
                    <div className="col-md-1">
                        <Leftsidebar />
                    </div>
                    <div className="col-md-11">
                        <div className="final__bg__09">
                            <div className="seaech__box___00 ">
                                <div className="row flex-column  dashboardpage flex-md-row">
                                    <div className="col-md-2 d-flex justify-content-center justiClass align-items-center">
                                        <div className="s_09ssd">
                                            <h3>Resources</h3>
                                        </div>
                                    </div>
                                    <div className=" col-md-3 col-lg-4 col-xl-5 col-12">
                                        <TextField
                                            style={{ height: "48px", width: "100%" }}
                                            className="serch"
                                            hiddenLabel
                                            type="text"
                                            id="filled-hidden-label-normal"
                                            placeholder="Search..."
                                            variant="filled"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                    <div className=" col-md-7 justiClass  col-lg-6 col-xl-5 col-12 justify-content-end d-flex">
                                        <Button
                                            style={{
                                                background: "#007AB6",
                                                width: "217px",
                                                height: "48px",
                                            }}
                                            onClick={() => handleOpen()}
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                        >
                                            Create New Resource
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="table-container">


                            <table {...getTableProps()} className="table">
                                <thead style={{ background: "#007AB6" }}>
                                    {headerGroups.map((headerGroup) => (
                                        <tr
                                            {...headerGroup.getHeaderGroupProps()}
                                            style={{ background: "#007AB6" }}
                                        >
                                            {headerGroup.headers.map((column) => (
                                                <th
                                                    {...column.getHeaderProps()}
                                                    style={{
                                                        background: "#007AB6",
                                                        padding: "15px 0.5rem",
                                                    }}
                                                >
                                                    {column.render("Header")}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody
                                    {...getTableBodyProps()}
                                    style={{ background: "#ffffff" }}
                                    className="tbod"
                                >
                                    {rows.map((row, ind) => {
                                        prepareRow(row);
                                        return (
                                            <tr
                                                {...row.getRowProps()}
                                                style={{ background: "#ffffff" }}
                                            >
                                                {row.cells.map((cell, cellIndex) => {
                                                    return (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            style={{
                                                                background: "#ffffff",
                                                                paddingTop: "15px",
                                                                paddingBottom: "15px",
                                                            }}
                                                        >
                                                            {cellIndex === 0 ? ind + 1 : cell.render("Cell")}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        </div>

                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}  className="resourceModal" >
                    <Typography variant="h6" component="h2">
                        <h1 className="s__09iii">
                            {isEditing ? "Edit Resource" : "Create Resource"}
                        </h1>
                    </Typography>

                    <div className="s__set__09w">
                        <TextField
                            label="Resource Name"
                            name="Name"
                            value={role.Name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <Select
                                label="Enter Parent Name"
                                Placeholder="Select Resource Type"
                                labelId="assign-manager-label"
                                name="Type"
                                value={role.Type}
                                onChange={handleChange}
                                displayEmpty
                                disabled={loading}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                <MenuItem key="Labour" value="Labour">
                                    Labour
                                </MenuItem>
                                <MenuItem key="Non Labour" value="Non Labour">
                                    Non Labour
                                </MenuItem>

                                <MenuItem key="Material" value="Material">
                                    Material
                                </MenuItem>

                            </Select>
                        </FormControl>

                        <div className="button__00999">
                            <Button
                                className="wclose"
                                onClick={handleClose}
                                variant="contained"
                                color="secondary"
                            >
                                Close
                            </Button>
                            <Button onClick={handleSave} variant="contained" color="primary">
                                Save
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};
