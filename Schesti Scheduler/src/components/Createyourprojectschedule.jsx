import React, { useState } from "react";
import Header from "./Header";
import Leftsidebar from "./Leftsidebar";
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
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import { useTable, usePagination } from "react-table";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import GetAppIcon from "@mui/icons-material/GetApp";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import formatDate from "../formatDate";
import { backend_url } from "../constants/api";
import statuses from "../constants/statuses";
import { DeleteFilled } from "@ant-design/icons";
import { MapIcon } from "lucide-react";
import { PiChatCircleDotsDuotone } from "react-icons/pi";
import { RiEarthLine } from "react-icons/ri";
import {
  ChatBubbleOutline,
  LightbulbOutlined,
  MapOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { SettingIcon } from "./component-icons/SettingIcon";
export default function Createyourprojectschedule({ tasks }) {
  const selectedObs = useSelector((state) => state.project.selectedObs);
  const project = useSelector((state) => state.project.data);
  const project1 = { ...project };
  const navigate = useNavigate();
  // Modal state
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

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
  });

  const handleOpen = () => setOpen1(true);
  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    console.log(newProject);
    // Add new project logic here
    handleClose();
  };

  // Define sample data
  const data = React.useMemo(
    () => [
      {
        created: formatDate(project?.createdAt),
        managingCompany: "ABC Builders",
        ownerName: project?.owner,
        clientName: "John Marks",
        manager:
          Array.isArray(project?.toShowManager) &&
          project?.toShowManager?.length > 0
            ? project?.toShowManager[0]?.firstName +
              " " +
              project?.toShowManager[0]?.lastName
            : "",
        status: `${project?.projectStatus}`,
        // setWorkweek: (
        //   <Button variant="contained" color="primary">
        //     Set Workweek
        //   </Button>
        // ),
      },
    ],
    []
  );

  console.log("project", project);

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
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
    },
    usePagination
  );

  const [wbsId, setWbsId] = useState("");
  const [wbsName, setWbsName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreateWbs = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;

    const payload = {
      userId,
      wbsId,
      wbsName,
      startDate,
      endDate,
    };

    try {
      const response = await fetch(backend_url + "/createWbs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", data.message, "success");
        handleClose1();
        navigate("/wbs");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Internal server error", "error");
    }
  };

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
                        {project?.projectName}
                        <br />
                        {/* Project Name */}
                      </h3>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <ul className="button__action flex gap-4">
                      <li>
                        <EditIcon className="edit__099 text-[#007AB6] cursor-pointer !w-4" />
                      </li>
                      <li>
                        <DeleteFilled className="edit__099 text-[#007AB6] cursor-pointer !w-4" />
                      </li>
                      <li>
                        <MoreVertIcon className="edit__099 text-[#007AB6] cursor-pointer" />
                      </li>
                    </ul>
                  </div>

                  <div className="createtabel s____tablle__showing__this">
                    <div className="d-flex justify-content-between  chart2 my-5">
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>
                          Created
                        </div>
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
                        <div style={{ color: "#667085", fontSize: "14px" }}>
                          Managing Company{" "}
                        </div>
                        <div
                          style={{
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {selectedObs?.organization}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>
                          Owner Name
                        </div>
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
                        <div style={{ color: "#667085", fontSize: "14px" }}>
                          Client Name
                        </div>
                        <div
                          style={{
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {project?.client ?? "John Marks"}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>
                          Manager
                        </div>
                        <div
                          style={{
                            color: "#475467",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {Array.isArray(project?.toShowManager) &&
                          project?.toShowManager?.length > 0
                            ? project?.toShowManager[0]?.firstName +
                              " " +
                              project?.toShowManager[0]?.lastName
                            : ""}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div style={{ color: "#667085", fontSize: "14px" }}>
                          Status
                        </div>
                        <div
                          style={{
                            color:
                              project?.projectStatus === "STATUS_WAITING"
                                ? "#000000"
                                : "#0EA263",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {
                            statuses.find(
                              (status) =>
                                status.value === project?.projectStatus
                            )?.label
                          }
                        </div>
                      </div>
                      <div className="mr-10 d-flex justify-content-end">
                        <Button 
                          variant="contained" 
                          color="primary"
                          style={{ 
                            minWidth: "150px",
                            whiteSpace: "nowrap",
                            padding: "8px 16px"
                          }}
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
                        <div>{tasks}</div>
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
                        <div>{Math.round(project?.workingHours?.averageDailyHours || project?.workingHours?.totalWeeklyHours || 8)} Hrs</div>
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
              <Select
                label="Category"
                name="category"
                value={newProject.category}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="">Current OBS Projects</MenuItem>
                <MenuItem value="currentObsProjects">
                  Universal Construction
                </MenuItem>
                <MenuItem value="currentObsProjects2">
                  Current OBS Projects2
                </MenuItem>
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
                  marginRight: "10px"
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
