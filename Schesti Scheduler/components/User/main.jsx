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
import print from "../../images/print.png"
import email from "../../images/email.png"
import impt from "../../images/import.png"
import expt from "../../images/export.png"
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
    InputLabel,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import formatDate from "../../formatDate";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { backend_url } from "../../constants/api";
const buildHierarchy = (data) => {
    const hierarchy = {};

    data?.forEach((item) => {
        hierarchy[item._id] = { ...item, children: [] };
    });

    Object.keys(hierarchy)?.forEach((id) => {
        const item = hierarchy[id];
        if (item.parentRole !== "No Parent") {
            const parent = Object.values(hierarchy).find(
                (parentItem) => parentItem.Name === item.parentRole
            );
            if (parent) {
                parent.children.push(item);
            }
        }
    });

    return Object.values(hierarchy).filter(
        (item) => item.parentRole === "No Parent"
    );
};

function FadeMenu({ handleOpen, setProject, projectData }) {
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
                <MenuItem onClick={handleClose}>
                    <div className="d-flex gap-2" style={{ color: "#007AB6" }}>
                        <img src={view} />
                        <div>Delete</div>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default function Users() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [roles, setRoles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        photo: null,
        roleType: "",
        password: "",
    });
    const [hierarchicalRoles, setHierarchicalRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [imga, setImga] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleFileChange = (e) => {
        setUser({ ...user, photo: e.target.files[0] });
        setImga(URL.createObjectURL(e.target.files[0]));
    };

    const handleSave = async () => {
        // Check for empty fields
        if (
            !user.firstName ||
            !user.lastName ||
            !user.email ||
            !user.roleType ||
            !user.password ||
            !user.photo
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill in all required fields!",
                confirmButtonColor: "#007AB6",
            });
            return; // Stop the function if validation fails
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("firstName", user.firstName);
        formData.append("lastName", user.lastName);
        formData.append("email", user.email);
        if (user.photo) formData.append("photo", user.photo);
        formData.append("roleType", user.roleType);
        formData.append("password", user.password);

        try {
            if (isEditing) {
                await axios.put(
                    backend_url+`/users/${user._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                await axios.post(backend_url+"/users", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            fetchUsersData();
            handleClose();
            setUser({
                userId: "",
                firstName: "",
                lastName: "",
                email: "",
                photo: null,
                roleType: "",
                password: "",
            });
            fetchUsersData();
        } catch (error) {
            console.error("Error creating user:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to create user. Please try again.",
                confirmButtonColor: "#007AB6",
            });
        }
    };

    useEffect(() => {
        // Retrieve user from local storage when the component mounts
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserId(user._id);
        }
    }, []);
    const fetchUsersData = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        try {
            const response = await axios.get(
                backend_url+`/users/${user?._id}`
            );
            setUsersData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
            Swal.fire("Error", "Failed to fetch Users data", "error");
        }
    };
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                backend_url+`/roles/${userId}`
            );
            const formattedData = buildHierarchy(response.data);
            console.log(formattedData);
            setHierarchicalRoles(formattedData);

            setRoles(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };
    useEffect(() => {
        if (userId) {
            fetchUsersData();
            fetchRoles();
        }
    }, [userId]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleEdit = (userData) => {
        setIsEditing(true); // Set to edit mode
        setUser(userData);
        setImga(`http://localhost:5000/backend${userData.photo}`);

        handleOpen();
    };
    const columns = React.useMemo(
        () => [
            {
                Header: "No.",
                id: "index",
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: "User ID",
                accessor: "userId",
            },
            {
                Header: "First Name",
                accessor: "firstName",
            },
            {
                Header: "Last Name",
                accessor: "lastName",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Photo",
                accessor: "photo",
                Cell: ({ cell: { value } }) => (
                    <img
                        src={`http://localhost:5000/backend${value}`}
                        alt="User Photo"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                ),
            },
            {
                Header: "Role Type",
                accessor: "roleType",
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <FadeMenu
                        handleOpen={() => handleEdit(row.original)}
                        setProject={setSelectedUser}
                        projectData={row.original}
                    />
                ),
            },
        ],
        []
    );

    const filteredUsers = React.useMemo(
        () =>
            usersData.filter(
                (user) =>
                    user?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user?.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [usersData, searchQuery]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: filteredUsers });
    const renderMenuItems = (data, level = 0) => {
        return data.flatMap(item => [
            <MenuItem key={item._id} value={item.Name} style={{ paddingLeft: level * 20 }}>
                {item.Name}
            </MenuItem>,
            ...renderMenuItems(item.children, level + 1)
        ]);
    };
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
                            <div className="seaech__box___00">
                                <div className="row flex-column flex-md-row dashboardpage">
                                    <div className="col-md-2 d-flex justify-content-center  justiClass justify-content-md-start align-items-center">
                                        <div className="s_09ssd  justiClass justify-content-md-start">
                                            <h3>Users</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-lg-4 col-xl-5 col-12">
                                        {/* Search bar */}
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
                                    <div className="col-md-7 col-lg-6 col-xl-5 col-12 justify-content-md-start justiClass   justify-content-end d-flex">
                                        {/* Create New User button */}
                                        <Button
                                            style={{
                                                background: "#007AB6",
                                                width: "217px",
                                                height: "48px",
                                            }}
                                            onClick={() => {
                                                setIsEditing(false); // Set to add mode
                                                handleOpen();
                                            }}
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                        >
                                            Create New User
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
                                                        padding: "15px  0.5rem ",
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
                                    {rows.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <tr
                                                {...row.getRowProps()}
                                                style={{ background: "#ffffff" }}
                                            >
                                                {row.cells.map((cell) => {
                                                    return (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            style={{
                                                                background: "#ffffff",
                                                                paddingTop: "15px",
                                                                paddingBottom: "15px",
                                                            }}
                                                        >
                                                            {cell.render("Cell")}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for creating or editing a user */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}  className="userModal" >
                    <Typography variant="h6" component="h2">
                        <h1 className="s__09iii">{isEditing ? "Edit User" : "Add User"}</h1>
                    </Typography>

                    <div className="s__set__09w">
                        <TextField
                            required
                            label="First Name"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            required
                            label="Last Name"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            required
                            label="Email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="photo-upload"
                            type="file"
                            onChange={handleFileChange}
                        />
                        {isEditing ? (
                            <img src={imga} style={{ width: "100px", height: "100px" }} />
                        ) : (
                            ""
                        )}
                        <label htmlFor="photo-upload">
                            <Button variant="contained" color="primary" component="span">
                                Upload Photo
                            </Button>
                        </label>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="assign-manager-label">
                                Assign role
                            </InputLabel>
                            <Select
                                label="Assign Role"
                                labelId="assign-manager-label"
                                name="roleType"
                                value={user.roleType}
                                onChange={handleChange}
                                displayEmpty
                                disabled={loading}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {roles.length > 0 ? (
                                    renderMenuItems(hierarchicalRoles)
                                ) : (
                                    <MenuItem value="No Parent">
                                        {loading ? "Loading..." : "No Parent"}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <TextField
                            required
                            label="Password"
                            name="password"
                            type="password"
                            value={user.password}
                            onChange={handleChange}
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
                            <Button onClick={handleSave} variant="contained" color="primary">
                                {isEditing ? "Update User" : "Save User"}
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
