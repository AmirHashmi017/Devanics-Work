import React, { useEffect, useState } from "react";
import Header from "./Header";
import Leftsidebar from "./Leftsidebar";
import icon__star from "../images/icons1.svg";
import cv1 from "../images/cv1.svg";
import cv2 from "../images/cv2.svg";
import cv3 from "../images/cv3.svg";
import cv4 from "../images/cv4.svg";
import cv5 from "../images/cv5.svg";
import cv6 from "../images/cv6.svg";
import cv7 from "../images/cv7.svg";
import cv8 from "../images/cv8.svg";
import cv9 from "../images/cv9.svg";
import cv10 from "../images/cv10.svg";
import cv11 from "../images/cv11.svg";
import cv12 from "../images/cv12.svg";
import cv13 from "../images/cv13.svg";
import cv14 from "../images/cv14.svg";
import cv15 from "../images/cv15.svg";
import cv16 from "../images/cv16.svg";
import cv17 from "../images/cv17.svg";
import cv18 from "../images/cv18.svg";
import cv19 from "../images/cv19.svg";
import cv20 from "../images/cv20.svg";

import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Swal from "sweetalert2";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { backend_url } from "../constants/api";
import { useSelector } from "react-redux";
import formatDate from "../formatDate";
import statuses from "../constants/statuses";
import { DeleteFilled } from "@ant-design/icons";

export default function Ganttchatv2() {
  const selectedObs = useSelector((state) => state.project.selectedObs);
  const project = useSelector((state) => state.project.data);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({ 0: true });
  const [newProject, setNewProject] = useState({
    WBS_Id: "",
    wbsId: "",
    wbsName: "",
    startDate: "",
    endDate: "",
  });

  const handleClose1 = () => setOpen1(false);
  const handleOpen1 = () => setOpen1(true);

  const handleWBSID = (value) => {
    setNewProject(...newProject, { WBS_Id: value });
  };

  const [obsData, setObsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchObsData = async () => {
    try {
      const response = await axios.get(
        backend_url + "/getAllWbs"
      );
      setObsData(response?.data.data);
      console.log("response", response);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      Swal.fire("Error", "Failed to fetch OBS data", "error");
    }
  };
  useEffect(() => {
    fetchObsData();
  }, []);

  const handleOpen = (value) => {
    console.log("valuevalue", value);
    setOpen(true);
    setNewProject((prev) => ({ ...prev, WBS_Id: value }));
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        backend_url + "/createSubWbs",
        newProject
      );
      if (response.status === 200) {
        Swal.fire("Success", "Sub WBS created successfully", "success");
        handleClose();
        fetchObsData();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to create Sub WBS", "error");
    }
  };

  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDataChange = (e, rowIndex, childIndex = null) => {
    const { name, value } = e.target;
    setObsData((prev) => {
      const newData = [...prev];
      if (childIndex !== null) {
        newData[rowIndex].subWbs[childIndex][name] = value;
      } else {
        newData[rowIndex][name] = value;
      }
      return newData;
    });
  };

  const addRow = () => {
    const newRow = {
      id: Date.now(),
      wbsId: "",
      wbsName: "",
      duration: "",
      status: "",
      startDate: "",
      endDate: "",
      actualStartDate: "",
      scheduleCompleted: "",
      totalFloat: "",
      subWbs: [],
    };
    setObsData((prev) => [...prev, newRow]);
  };

  const removeRow = (rowIndex) => {
    setObsData((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const addChildRow = (rowIndex) => {
    const newChildRow = {
      id: Date.now(),
      wbsId: "",
      wbsName: "",
      duration: "",
      status: "",
      startDate: "",
      endDate: "",
      actualStartDate: "",
      scheduleCompleted: "",
      totalFloat: "",
    };
    setObsData((prev) => {
      const newData = [...prev];
      newData[rowIndex].subWbs.push(newChildRow);
      return newData;
    });
  };

  const removeChildRow = (rowIndex, childIndex) => {
    setObsData((prev) => {
      const newData = [...prev];
      newData[rowIndex].subWbs.splice(childIndex, 1);
      return newData;
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        backend_url + `/deleteWbs/${id}`
      );
      if (response.status === 200) {
        Swal.fire("Success", "WBS deleted successfully", "success");
        fetchObsData();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete WBS", "error");
    }
  };

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
        fetchObsData();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Internal server error", "error");
    }
  };

  const [wbsId, setWbsId] = useState("");
  const [wbsName, setWbsName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const HOVERED_MARGIN_LEFT = 'ml-[240px]';
  const UNHOVERED_MARGIN_LEFT = 'ml-[80px]';
  const [isOpened, setisOpened] = useState(true);

  const toggleCollapsed = () => {
    setisOpened(!isOpened);
  };

  return (
    <>
      <Leftsidebar isOpened={isOpened} toggleCollapsed={toggleCollapsed} />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isOpened ? HOVERED_MARGIN_LEFT : UNHOVERED_MARGIN_LEFT}`}>
        <Header />
        <div className="mainpage">
          <div className="row">
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
                          {project?.projectName || "Universal Construction"}
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
                      <div className="d-flex justify-content-between chart2 my-5">
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
                          <div>{obsData?.length || 0}</div>
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
                          <div>{project?.duration || "03 Month"} Days</div>
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

              <div className="seaech__box___00 s__0987gg">
                <div className="top__cv__showing">
                  <ul>
                    <li onClick={addRow}>
                      <span>
                        {" "}
                        <img src={cv1} alt="add-row-icon" />
                      </span>
                    </li>
                    <li onClick={addRow}>
                      <span>
                        {" "}
                        <img src={cv2} alt="add-row-icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv3} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv4} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv5} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv6} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv7} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv8} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv9} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv10} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv11} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv12} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv13} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv14} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv15} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv16} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv17} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv18} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv19} alt="icon" />
                      </span>
                    </li>
                    <li>
                      <span>
                        {" "}
                        <img src={cv20} alt="icon" />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="main_nav_menu">
                <Link to="/wbs">
                  <button className="newButt ">WBS</button>
                </Link>
                <Link to="/Ganttchatv">
                  <button className="newButt newButt_active">Activities</button>
                </Link>
                <Link to="/Ganttchatv2">
                  <button className="newButt ">View Gantt Chart</button>
                </Link>
              </div>
              
              {/* Split View Container */}
              <div className="final__bg__09 s__bggg" style={{ display: 'flex', height: '600px' }}>
                {/* Left Panel - Table */}
                <div className="table__and__content" style={{ flex: '0 0 40%', overflow: 'auto', borderRight: '1px solid #e0e0e0' }}>
                  <div className="row">
                    <div className="col-md-12">
                      <table className="table">
                        <thead>
                          <tr className="tt__09">
                            <th width="2%"></th>
                            <th width="5%">ID</th>
                            <th width="20%">Activities</th>
                            <th width="10%">Original Duration</th>
                            <th width="10%">Status</th>
                            <th width="10%">Start</th>
                            <th width="10%">Finish</th>
                            <th width="10%">Actual Start</th>
                            <th width="10%">Schedule % Completed</th>
                            <th width="10%">Total Float</th>
                            <th width="3%"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {obsData?.map((row, index) => (
                            <React.Fragment key={row.id}>
                              <tr>
                                <td>
                                  <img
                                    src={icon__star}
                                    onClick={() => toggleExpandRow(index)}
                                    style={{ cursor: "pointer" }}
                                    alt="expand-icon"
                                  />
                                </td>
                                <td width="5%">
                                  <input
                                    type="text"
                                    name="wbsId"
                                    value={row.wbsId}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="HafizBuilderProperty"
                                    value={row.wbsName}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="duration"
                                    // value={row.duration}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="status"
                                    // value={row.status}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    name="startDate"
                                    value={row?.startDate}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    name="endDate"
                                    value={row.endDate}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    name="actualStartDate"
                                    // value={row.actualStartDate}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="scheduleCompleted"
                                    // value={row.scheduleCompleted}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="totalFloat"
                                    // value={row.totalFloat}
                                    onChange={(e) => handleDataChange(e, index)}
                                  />
                                </td>
                                <td>
                                  <Button onClick={() => removeRow(index)}>
                                    <DeleteOutlineIcon />
                                  </Button>
                                </td>
                              </tr>

                              {expandedRows[index] && (
                                <tr
                                  className="s__098g45456"
                                  key={`${row.id}-child`}
                                >
                                  <td colSpan={11}>
                                    <table className="table">
                                      <tbody>
                                        {row.subWbs.map(
                                          (childRow, childIndex) => (
                                            <tr key={childRow.id}>
                                              <td className="border__09">
                                                <img
                                                  src={icon__star}
                                                  alt="child-icon"
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  name="wbsId"
                                                  value={childRow.wbsId}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  name="wbsName"
                                                  value={childRow.wbsName}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  name="duration"
                                                  // value={childRow.duration}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  name="status"
                                                  // value={childRow.status}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="date"
                                                  name="startDate"
                                                  value={childRow?.startDate}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="date"
                                                  name="endDate"
                                                  value={childRow.endDate}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="date"
                                                  name="actualStartDate"
                                                  // value={childRow.actualStartDate}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  name="scheduleCompleted"
                                                  // value={childRow.scheduleCompleted}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  name="totalFloat"
                                                  // value={childRow.totalFloat}
                                                  onChange={(e) =>
                                                    handleDataChange(
                                                      e,
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                />
                                                <Button
                                                  className="s__098001441"
                                                  onClick={() =>
                                                    removeChildRow(
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                >
                                                  <DeleteOutlineIcon />
                                                </Button>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                        <Button
                                          className="s__listttgg"
                                          onClick={() => handleOpen(row._id)}
                                        >
                                          Add activity
                                        </Button>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                      <Button onClick={handleOpen1}>Add WBS</Button>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Gantt Chart */}
                <div className="gantt-chart-container" style={{ flex: '0 0 60%', overflow: 'auto', padding: '20px' }}>
                  <div className="gantt-header" style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Gantt Chart Timeline</h3>
                    <div className="timeline-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Timeline: 26 May - 02 Sep</span>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button style={{ padding: '5px 10px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Zoom In</button>
                        <button style={{ padding: '5px 10px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Zoom Out</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="gantt-timeline" style={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '4px',
                    background: '#f9f9f9',
                    padding: '20px',
                    minHeight: '400px'
                  }}>
                    <div className="timeline-header" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '20px',
                      borderBottom: '1px solid #ddd',
                      paddingBottom: '10px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>Task</span>
                      <span style={{ fontWeight: 'bold' }}>Progress</span>
                      <span style={{ fontWeight: 'bold' }}>Timeline</span>
                    </div>
                    
                    {/* Sample Gantt Bars */}
                    <div className="gantt-bars" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div className="gantt-bar" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px',
                        padding: '10px',
                        background: '#fff',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <span style={{ minWidth: '150px', fontWeight: '500' }}>2004 Hafiz Builder Property</span>
                        <div style={{ 
                          width: '200px', 
                          height: '20px', 
                          background: '#e3f2fd', 
                          borderRadius: '10px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: '51%', 
                            height: '100%', 
                            background: '#2196f3', 
                            borderRadius: '10px'
                          }}></div>
                          <span style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>51%</span>
                        </div>
                        <div style={{ 
                          width: '300px', 
                          height: '20px', 
                          background: '#f5f5f5', 
                          borderRadius: '10px',
                          position: 'relative'
                        }}>
                          <div style={{ 
                            width: '60%', 
                            height: '100%', 
                            background: '#4caf50', 
                            borderRadius: '10px'
                          }}></div>
                        </div>
                      </div>
                      
                      <div className="gantt-bar" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px',
                        padding: '10px',
                        background: '#fff',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        marginLeft: '20px'
                      }}>
                        <span style={{ minWidth: '150px', fontWeight: '500' }}>2004.1 DIV-03 - Concrete</span>
                        <div style={{ 
                          width: '200px', 
                          height: '20px', 
                          background: '#e3f2fd', 
                          borderRadius: '10px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: '37%', 
                            height: '100%', 
                            background: '#2196f3', 
                            borderRadius: '10px'
                          }}></div>
                          <span style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>37%</span>
                        </div>
                        <div style={{ 
                          width: '300px', 
                          height: '20px', 
                          background: '#f5f5f5', 
                          borderRadius: '10px',
                          position: 'relative'
                        }}>
                          <div style={{ 
                            width: '40%', 
                            height: '100%', 
                            background: '#4caf50', 
                            borderRadius: '10px'
                          }}></div>
                        </div>
                      </div>
                      
                      <div className="gantt-bar" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px',
                        padding: '10px',
                        background: '#fff',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        marginLeft: '40px'
                      }}>
                        <span style={{ minWidth: '150px', fontWeight: '500' }}>101 - Foundation Work</span>
                        <div style={{ 
                          width: '200px', 
                          height: '20px', 
                          background: '#e3f2fd', 
                          borderRadius: '10px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: '55%', 
                            height: '100%', 
                            background: '#2196f3', 
                            borderRadius: '10px'
                          }}></div>
                          <span style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>55%</span>
                        </div>
                        <div style={{ 
                          width: '300px', 
                          height: '20px', 
                          background: '#f5f5f5', 
                          borderRadius: '10px',
                          position: 'relative'
                        }}>
                          <div style={{ 
                            width: '70%', 
                            height: '100%', 
                            background: '#4caf50', 
                            borderRadius: '10px'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal open={open} onClose={handleClose}>
          <Box sx={{ ...style, width: 700 }}>
            <Typography variant="h6" component="h2">
              <h1>Create SUB WBS Structure</h1>
            </Typography>
            <div>
              <TextField
                label="WBS ID"
                name="wbsId"
                value={newProject.wbsId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="WBS Name"
                name="wbsName"
                value={newProject.wbsName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Start Date"
                name="startDate"
                value={newProject?.startDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                label="End Date"
                name="endDate"
                value={newProject.endDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                >
                  Close
                </Button>
                <Button
                  onClick={handleCreate}
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "20px" }}
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
                >
                  Close
                </Button>
                <Button
                  onClick={handleCreateWbs}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
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
