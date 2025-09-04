import React, { useEffect, useState } from "react";
import Header from "./Header"; // Adjust the import path as necessary
import Leftsidebar from "./Leftsidebar"; // Adjust the import path as necessary
import { useTable, usePagination } from "react-table";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Menu,
  MenuItem as MenuOption,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ModeEditOutline as ModeEditOutlineIcon,
  Visibility as VisibilityIcon,
  DeleteOutline as DeleteOutlineIcon,
  LocalPrintshop as LocalPrintshopIcon,
  MailOutline as MailOutlineIcon,
  FileUpload as FileUploadIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import { backend_url } from "../constants/api";

export default function Schedule() {
  // Modal state
  const [open, setOpen] = useState(false);
  const [openOBS, setOpenOBS] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newProject, setNewProject] = useState({
    projectNumber: "",
    projectName: "",
    managingCompany: "OSB",
    ownerRepresentative: "",
    dueDate: "",
    task: "",
    status: "Pending",
    category: "",
    description: "",
  });

  const [obsData, setObsData] = useState([
    {
      projectId: "298",
      projectName: "hdjbjfb",
      managerRepresentative: "Azeem",
      ownerRepresentative: "Amir Hashmi",
      dueDate: "30 Jul 2026",
      task: "6/40",
      projectStatus: "In Progress",
    },
    {
      projectId: "189",
      projectName: "Construction new Project",
      managerRepresentative: "",
      ownerRepresentative: "Amir Hashmi",
      dueDate: "15 Jul 2026",
      task: "5/37",
      projectStatus: "In Progress",
    },
    {
      projectId: "345",
      projectName: "Constructing new Project",
      managerRepresentative: "",
      ownerRepresentative: "Amir Hashmi",
      dueDate: "29 Jul 2026",
      task: "5/37",
      projectStatus: "In Progress",
    },
    {
      projectId: "189",
      projectName: "Construction new",
      managerRepresentative: "",
      ownerRepresentative: "Amir Hashmi",
      dueDate: "18 Aug",
      task: "5/37",
      projectStatus: "In Progress",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenOBS = () => setOpenOBS(true);
  const handleCloseOBS = () => setOpenOBS(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    console.log(newProject);
    // Add new project logic here
    handleClose();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredObsData = React.useMemo(
    () =>
      obsData.filter((project) =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [obsData, searchQuery]
  );

  const handleMenuOpen = (event, rowIndex) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowIndex);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    console.log("Edit action for row:", selectedRow);
    handleMenuClose();
  };

  const handleView = () => {
    console.log("View action for row:", selectedRow);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log("Delete action for row:", selectedRow);
    handleMenuClose();
  };

  const handlePrint = () => {
    console.log("Print action for row:", selectedRow);
    handleMenuClose();
  };

  const handleEmail = () => {
    console.log("Email action for row:", selectedRow);
    handleMenuClose();
  };

  const handleImportTimeSchedule = () => {
    console.log("Import Time Schedule action for row:", selectedRow);
    handleMenuClose();
  };

  const handleExportTimeSchedule = () => {
    console.log("Export Time Schedule action for row:", selectedRow);
    handleMenuClose();
  };

  // Define columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Project #",
        accessor: "projectId",
      },
      {
        Header: "Project Name",
        accessor: "projectName",
      },
      {
        Header: "Manager Representative",
        accessor: "managerRepresentative",
      },
      {
        Header: "Owner Representative",
        accessor: "ownerRepresentative",
      },
      {
        Header: "Due Date",
        accessor: "dueDate",
      },
      {
        Header: "Task",
        accessor: "task",
      },
      {
        Header: "Status",
        accessor: "projectStatus",
        Cell: ({ value }) => (
          <span style={{ color: "#0EA263", fontWeight: "500" }}>{value}</span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <IconButton
            onClick={(e) => handleMenuOpen(e, row.index)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ],
    []
  );

  // Use the useTable and usePagination hooks to create the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredObsData,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
    },
    usePagination
  );

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
                <div className="row">
                  <div className="col-md-3">
                    <div className="s_09ssd">
                      <h3>Schedule</h3>
                    </div>
                  </div>
                  <div className="col-md-4">
                    {/* Search bar */}
                    <div style={{ position: "relative" }}>
                      <SearchIcon 
                        style={{ 
                          position: "absolute", 
                          left: "10px", 
                          top: "50%", 
                          transform: "translateY(-50%)",
                          color: "#667085"
                        }} 
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ paddingLeft: "35px" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-5 text-right">
                    {/* Create buttons */}
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleOpenOBS}
                      style={{ 
                        marginRight: "10px",
                        minWidth: "120px",
                        whiteSpace: "nowrap",
                        padding: "8px 16px"
                      }}
                    >
                      <AddIcon style={{ marginRight: "5px" }} />
                      Create OBS
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleOpen}
                      style={{ 
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                        padding: "8px 16px"
                      }}
                    >
                      <AddIcon style={{ marginRight: "5px" }} />
                      Create New Project
                    </Button>
                  </div>
                </div>
              </div>

              <table {...getTableProps()} className="table" style={{ marginTop: "20px" }}>
                <thead style={{ backgroundColor: "#F9FAFB" }}>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th 
                          {...column.getHeaderProps()} 
                          style={{ 
                            padding: "12px 16px",
                            textAlign: "left",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "1px solid #E5E7EB"
                          }}
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} style={{ backgroundColor: "white" }}>
                        {row.cells.map((cell) => {
                          return (
                            <td 
                              {...cell.getCellProps()} 
                              style={{ 
                                padding: "12px 16px",
                                borderBottom: "1px solid #E5E7EB"
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
              </table>

              {/* Pagination Controls */}
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                marginTop: "20px",
                gap: "10px"
              }}>
                <Button 
                  onClick={() => previousPage()} 
                  disabled={!canPreviousPage}
                  variant="outlined"
                  size="small"
                >
                  Previous
                </Button>
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>
                </span>
                <Button 
                  onClick={() => nextPage()} 
                  disabled={!canNextPage}
                  variant="outlined"
                  size="small"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuOption onClick={handleEdit}>
          <ModeEditOutlineIcon style={{ marginRight: "8px" }} />
          Edit
        </MenuOption>
        <MenuOption onClick={handleView}>
          <VisibilityIcon style={{ marginRight: "8px" }} />
          View
        </MenuOption>
        <MenuOption onClick={handlePrint}>
          <LocalPrintshopIcon style={{ marginRight: "8px" }} />
          Print
        </MenuOption>
        <MenuOption onClick={handleEmail}>
          <MailOutlineIcon style={{ marginRight: "8px" }} />
          Email
        </MenuOption>
        <MenuOption onClick={handleImportTimeSchedule}>
          <FileUploadIcon style={{ marginRight: "8px" }} />
          Import Time Schedule
        </MenuOption>
        <MenuOption onClick={handleExportTimeSchedule}>
          <DownloadIcon style={{ marginRight: "8px" }} />
          Export Time Schedule
        </MenuOption>
      </Menu>

      {/* Modal for creating a new project */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 700 }}>
          <Typography variant="h6" component="h2">
            <h1 className="s__09iii">Create New Project</h1>
          </Typography>

          <div className="s__set__09w">
            <TextField
              label="Project Number"
              name="projectNumber"
              value={newProject.projectNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Project Name"
              name="projectName"
              value={newProject.projectName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Manager Representative"
              name="managerRepresentative"
              value={newProject.managerRepresentative}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Owner Representative"
              name="ownerRepresentative"
              value={newProject.ownerRepresentative}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={newProject.dueDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              name="description"
              value={newProject.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <div className="button__00999">
              <Button
                className="wclose"
                onClick={handleClose}
                variant="contained"
                color="secondary"
                style={{ 
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                  padding: "8px 16px",
                  marginRight: "10px"
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleCreate}
                variant="contained"
                color="primary"
                style={{ 
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                  padding: "8px 16px"
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Modal for creating OBS */}
      <Modal open={openOBS} onClose={handleCloseOBS}>
        <Box sx={{ ...style, width: 700 }}>
          <Typography variant="h6" component="h2">
            <h1 className="s__09iii">Create OBS Structure</h1>
          </Typography>

          <div className="s__set__09w">
            <TextField
              label="OBS ID"
              name="obsId"
              fullWidth
              margin="normal"
            />
            <TextField
              label="OBS Name"
              name="obsName"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <div className="button__00999">
              <Button
                className="wclose"
                onClick={handleCloseOBS}
                variant="contained"
                color="secondary"
                style={{ 
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                  padding: "8px 16px",
                  marginRight: "10px"
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleCloseOBS}
                variant="contained"
                color="primary"
                style={{ 
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                  padding: "8px 16px"
                }}
              >
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
