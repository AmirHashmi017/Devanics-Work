"use client"

import React, { useState, useEffect } from "react"
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Slide,
  Alert,
  Snackbar,
} from "@mui/material"
import UpdateProject from "./UpdateProject";
import HomeIcon from "@mui/icons-material/Home"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import EditIcon from "@mui/icons-material/Edit"
import { useTable, usePagination } from "react-table"
import AssignmentIcon from "@mui/icons-material/Assignment"
import ScheduleIcon from "@mui/icons-material/Schedule"
import { useDispatch } from "react-redux";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import formatDate from "../formatDate"
import { backend_url } from "../constants/api"
import statuses from "../constants/statuses"
import { DeleteFilled } from "@ant-design/icons"
import { setProjectData, setSelectedOBS } from "./redux/projectSlice";
import axios from "axios"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function Createyourprojectschedule({ totalTasks }) {
  const selectedObs = useSelector((state) => state.project.selectedObs)
  const project = useSelector((state) => state.project.data)
  const project1 = { ...project }
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  // Modal state
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function fetchTasks() {
      if (!project?._id || !selectedObs?.userId) return
      try {
        const response = await axios.get(`${backend_url}/chartsA/${selectedObs.userId}/${project._id}`)
        setTasks(response.data?.tasks || [])
      } catch (error) {
        setTasks([])
      }
    }
    fetchTasks()
    console.log(project)
  }, [project, selectedObs]) // Updated dependency array

  const [newProject, setNewProject] = useState({
    projectNumber: "",
    projectName: "",
    managingCompany: "OSB",
    ownerRepresentative: "",
    dueDate: "",
    task: "",
    status: "STATUS_WAITING",
    projectStatus: "",
    category: "",
    description: "",
    startdate: "",
    enddate: "",
    assignManager: "",
  })

  const handleOpen = () => setOpen1(true)
  const handleClose = () => setOpen(false)
  const handleClose1 = () => setOpen1(false)

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true)
  }
  const handleOpenUpdateModal = () => {
  setOpenUpdateModal(true);
};
const handleCloseUpdateModal = () => {
  setOpenUpdateModal(false);
};
const handlesetWorkweek = () => {
    console.log(project);
    dispatch(setProjectData(project));
    navigate("/calender");
  };
  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    setDeleteConfirmOpen(false)

    try {
      const response = await axios.delete(`${backend_url}/project/${selectedObs.userId}/${project._id}`)

      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Project deleted successfully!",
          severity: "success",
        })

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/")
        }, 1500)
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to delete project. Please try again.",
        severity: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    console.log(project?.toShowManager[0])
    console.log(project)
  }

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setNotification((prev) => ({ ...prev, open: false }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = () => {
    // Add new project logic here
    handleClose()
  }

  // Define sample data
  const data = React.useMemo(
    () => [
      {
        created: formatDate(project?.createdAt),
        managingCompany: "ABC Builders",
        ownerName: project?.owner.name,
        clientName: project?.client ?? "John Marks",
        manager:
          Array.isArray(project?.assignManager) && project?.assignManager?.length > 0
            ? project?.assignManager[0]?.name
            : "",
        status: `${project?.projectStatus}`,
        // setWorkweek: (
        //   <Button variant="contained" color="primary">
        //     Set Workweek
        //   </Button>
        // ),
      },
    ],
    [],
  )

  // Define columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Created",
        accessor: "created",
      },
      {
        Header: "Managing Company",
        accessor: "managingCompany",
      },
      {
        Header: "Owner Name",
        accessor: "ownerName",
      },
      {
        Header: "Client Name",
        accessor: "clientName",
      },
      {
        Header: "Manager",
        accessor: "manager",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      // {
      //   Header: "",
      //   accessor: "setWorkweek",
      // },
    ],
    [],
  )

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
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
    },
    usePagination,
  )

  const [wbsId, setWbsId] = useState("")
  const [wbsName, setWbsName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleCreateWbs = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user._id

    const payload = {
      userId,
      wbsId,
      wbsName,
      startDate,
      endDate,
    }

    try {
      const response = await fetch(backend_url + "/createWbs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        Swal.fire("Success", data.message, "success")
        handleClose1()
        navigate("/wbs")
      } else {
        Swal.fire("Error", data.message, "error")
      }
    } catch (error) {
      Swal.fire("Error", "Internal server error", "error")
    }
  }

  return (
    <>
      <div className="mainpa ge">
        <div className="row">
          {/* <div className="col-md-1">
            <Leftsidebar />
          </div> */}
          <div className="col-md-12 mb-3">
            <div className="final__bg__09 s__0989000112">
              <div className="seaech__box___00">
                <div className="row">
                  <div className="col-md-8">
                    <div className="s_09ssd">
                      <h3>
                        <span className="s__999099">
                          <HomeIcon />
                        </span>
                        {project.obsId?.organization}
                        <br />
                        {/* Project Name */}
                      </h3>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <ul className="button__action flex gap-4">
                      <li>
                        <EditIcon className="edit__099 text-[#007AB6] cursor-pointer !w-4"
                        onClick={handleOpenUpdateModal} />
                        
                      </li>
                      <li>
                        <DeleteFilled
                          className="edit__099 text-[#007AB6] cursor-pointer !w-4"
                          onClick={handleDeleteClick}
                        />
                      </li>
                      <li>
                        <MoreVertIcon className="edit__099 text-[#007AB6] cursor-pointer" />
                      </li>
                    </ul>
                  </div>

                  <div className="createtabel s____tablle__showing__this">
                    <div className="d-flex justify-content-between  chart2 my-5">
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>Created</div>
                        <div
                          style={{
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {formatDate(project?.createdAt)}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>Managing Company </div>
                        <div
                          style={{
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {project.userId?.organizationName}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>Owner Name</div>
                        <div
                          style={{
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {project?.owner}
                        </div>
                      </div>
                     
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>Manager</div>
                        <div
                          style={{
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {Array.isArray(project?.assignManager) && project?.assignManager?.length > 0
            ? project?.assignManager[0]?.name
            : ""}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>Status</div>
                              <div
  style={{
    color: "#0EA263", // White text when green bg
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#10DD8629", // Green bg if not waiting
    padding: "4px 4px",
    borderRadius: "6px",
    display: "inline-block",
  }}
>
  {statuses.find((status) => status.value === project?.projectStatus)?.label}
</div>


                      </div>
                      <div className="mr-10 d-flex justify-content-end">
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            minWidth: "150px",
                            whiteSpace: "nowrap",
                            padding: "8px 16px",
                          }}
                          onClick={handlesetWorkweek} 
                        >
                          Set Workweek
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="taskmanages">
                <div className="row">
                  <div className="col-md-4">
                    <div className="totaltasks__sd">
                      <div className="left__total__09">
                        <span className="task__iconss">
                          <AssignmentIcon />
                        </span>
                        <span className="subhdd">Total Tasks</span>
                      </div>
                      <div className="c__b447 hdd">
  <div>{totalTasks}</div>  
</div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="totaltasks__sd">
                      <div className="left__total__09">
                        <span className="task__iconss">
                          <CalendarMonthIcon />
                        </span>
                        <span className="subhdd">Duration</span>
                      </div>
                      <div className="c__b447 hdd">
                        <div>{project?.duration} Days</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="totaltasks__sd d__0987">
                      <div className="left__total__09">
                        <span className="task__iconss">
                          <ScheduleIcon />
                        </span>
                        <span className="subhdd">Daily Hour</span>
                      </div>
                      <div className="c__b447 hdd">
                        <div>
                          {Math.round(
                            project?.workingHours?.averageDailyHours || project?.workingHours?.totalWeeklyHours || 8,
                          )}{" "}
                          Hrs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="createyouproject">
              <h3 className="create__098778">Schedule</h3>
              <div className="show__create_your__projects">
                <div className="row">
                  <div className="col-md-6 offset-3">
                    <div className="show___111444s">
                      <h3>Create your project Schedule</h3>
                      <p>
                        Lorem ipsum is a placeholder text commonly used to
                        demonstrate the visual form of a document or a typeface
                        without relying on meaningful content.
                      </p>

                      <div className="button__00999 s_0987y">
                        <Button 
                          className="wclosessasa" 
                          onClick={handleOpen}
                          style={{ 
                            minWidth: "180px",
                            whiteSpace: "nowrap",
                            padding: "10px 20px",
                            marginRight: "10px"
                          }}
                        >
                          <AddIcon /> Create WBS
                        </Button>
                        <Button 
                          className="sav__098" 
                          color="primary"
                          style={{ 
                            minWidth: "180px",
                            whiteSpace: "nowrap",
                            padding: "10px 20px"
                          }}
                        >
                          <GetAppIcon /> Import Activities
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Modal for creating a new project */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 700 }}>
          <Typography variant="h6" component="h2">
            <h1 className="s__09iii">Create OBS Structure</h1>
          </Typography>

          <div className="s__set__09w">
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select label="Category" name="category" value={newProject.category} onChange={handleChange} displayEmpty>
                <MenuItem value="">Current OBS Projects</MenuItem>
                <MenuItem value="currentObsProjects">Universal Construction</MenuItem>
                <MenuItem value="currentObsProjects2">Current OBS Projects2</MenuItem>
              </Select>
            </FormControl>

            <h3 className="createnewobs">Create New OBS</h3>
            <TextField
              label="Project Number"
              name="projectNumber"
              value={newProject.projectNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={newProject.description} // Make sure this matches your state
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2} // Adjust the number of rows as needed
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
                  marginRight: "10px",
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
                  padding: "8px 16px",
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={open1} onClose={handleClose1}>
        <Box sx={{ ...style, width: 700 }}>
          <Typography variant="h6" component="h2">
            <h1 className="s__09iii">Create WBS Structure</h1>
          </Typography>

          <div className="s__set__09w">
            <h3 className="createnewobs1">Create New WBS</h3>
            <TextField
              label="WBS ID"
              name="wbsId"
              value={wbsId}
              onChange={(e) => setWbsId(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              style={{ marginTop: "20px" }}
              label="WBS NAME"
              name="wbsName"
              value={wbsName}
              onChange={(e) => setWbsName(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              style={{ marginTop: "20px" }}
              label="Start Date"
              type="date"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              style={{ marginTop: "20px" }}
              label="End Date"
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <div className="button__00999">
              <Button
                className="wclose"
                onClick={handleClose1}
                variant="contained"
                color="secondary"
                style={{
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                  padding: "8px 16px",
                  marginRight: "10px",
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleCreateWbs}
                variant="contained"
                color="primary"
                style={{
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                  padding: "8px 16px",
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <UpdateProject
  open={openUpdateModal}
  handleClose={handleCloseUpdateModal}
  project={project}
  refetchData={null}
/>

      <Dialog
        open={deleteConfirmOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteCancel}
        aria-describedby="delete-dialog-description"
        PaperProps={{
          style: {
            borderRadius: "16px",
            padding: "8px",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#d32f2f",
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          <WarningAmberIcon sx={{ color: "#ff9800", fontSize: "2rem" }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="delete-dialog-description"
            sx={{
              fontSize: "1rem",
              color: "#424242",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete this project? This action cannot be undone and will permanently remove all
            associated data, tasks, and schedules.
          </DialogContentText>
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#fff3e0",
              borderRadius: "8px",
              border: "1px solid #ffcc02",
            }}
          >
            <Typography variant="body2" sx={{ color: "#e65100", fontWeight: 500 }}>
              <strong>Project:</strong> {project?.projectName || "Current Project"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#e65100", mt: 0.5 }}>
              <strong>Tasks:</strong> {tasks.length} tasks will be deleted
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px", gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              minWidth: "100px",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
            sx={{
              minWidth: "100px",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "left" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 500,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
}
