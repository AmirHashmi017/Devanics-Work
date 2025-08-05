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
import calenddd from "../images/oo.jpg";

import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Swal from "sweetalert2";
import axios from "axios";
import formatDate from "../formatDate";
import { Link } from "react-router-dom";
import { backend_url } from "../constants/api";

export default function Wbs() {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

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
        backend_url+"/getAllWbs"
      );
      setObsData(response.data.data);
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
  const [data, setData] = useState([
    {
      id: "1",
      wbsId: "WBS001",
      wbsName: "Project Alpha",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      childRows: [
        {
          id: "1.1",
          wbsId: "WBS001-1",
          wbsName: "Task 1",
          startDate: "2023-01-10",
          endDate: "2023-01-20",
        },
        {
          id: "1.2",
          wbsId: "WBS001-2",
          wbsName: "Task 2",
          startDate: "2023-02-01",
          endDate: "2023-02-10",
        },
      ],
    },
    {
      id: "2",
      wbsId: "WBS002",
      wbsName: "Project Beta",
      startDate: "2023-02-01",
      endDate: "2023-11-30",
      childRows: [
        {
          id: "2.1",
          wbsId: "WBS002-1",
          wbsName: "Task 1",
          startDate: "2023-02-05",
          endDate: "2023-02-15",
        },
      ],
    },
    // The rest of the data remains unchanged...
  ]);

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
        backend_url+"/subcreateWbs",
        newProject
      );

      if (response.data.success) {
        console.log(response.data.message);
        fetchObsData();
        handleClose();
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error(
        "Error creating OBS:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  console.log("newProject", newProject);

  const handleDataChange = (e, rowIndex, childIndex = null) => {
    const { name, value } = e.target;
    setData((prevData) => {
      const newData = [...prevData];
      if (childIndex === null) {
        newData[rowIndex][name] = value;
      } else {
        newData[rowIndex].childRows[childIndex][name] = value;
      }
      return newData;
    });
  };

  const addRow = () => {
    setData((prevData) => [
      ...prevData,
      {
        id: `${prevData.length + 1}`,
        wbsId: "",
        wbsName: "",
        startDate: "",
        endDate: "",
        childRows: [],
      },
    ]);
  };

  const removeRow = (rowIndex) => {
    setData((prevData) => prevData.filter((_, index) => index !== rowIndex));
  };

  const addChildRow = (rowIndex) => {
    setData((prevData) => {
      const newData = [...prevData];
      const newChildRow = {
        id: `${newData[rowIndex].id}.${newData[rowIndex].childRows.length + 1}`,
        wbsId: "",
        wbsName: "",
        startDate: "",
        endDate: "",
      };
      newData[rowIndex].childRows.push(newChildRow);
      return newData;
    });
  };

  const removeChildRow = (rowIndex, childIndex) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex].childRows = newData[rowIndex].childRows.filter(
        (_, index) => index !== childIndex
      );
      return newData;
    });
  };

  const printDiv = (divId) => {
    const printContents = document.getElementById(divId).innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        backend_url+`/deleteWbs/${id}`
      );
      Swal.fire("Success", response.data.message, "success");
      fetchObsData();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Internal server error",
        "error"
      );
    }
  };

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
      const response = await fetch(
        backend_url+"/createWbs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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

  return (
    <>
      <Header />
      <div className="mainpage">
        <div className="row">
          <div className="col-md-1">
            <Leftsidebar />
          </div>
          <div className="col-md-11">
            <div className="seaech__box___00 s__0987gg">
              <div className="top__cv__showing">
                <ul>
                  <li onClick={addRow}>
                    <span>
                      {" "}
                      <img src={cv1} alt="child-icon" />
                    </span>
                  </li>
                  <li onClick={addRow}>
                    <span>
                      {" "}
                      <img src={cv2} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv3} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv4} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv5} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv6} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv7} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv8} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv9} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv10} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv11} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv12} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv13} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv14} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv15} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv16} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv17} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv18} alt="child-icon" />
                    </span>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <img src={cv19} alt="child-icon" />
                    </span>
                  </li>
                  <li className="clicktoopendropdown">
                    <span>
                      {" "}
                      <img src={cv20} alt="child-icon" />
                    </span>
                    <div className="submenu__000114400">
                      <ul>
                        <li onClick={() => printDiv("printableTable")}>
                          {" "}
                          Print tabular view{" "}
                        </li>
                        <li>Print chat view</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="main_nav_menu">
              <Link to="/wbs">
                <button className="newButt newButt_active">WBS</button>
              </Link>
              <Link to="/Ganttchatv">
                <button className="newButt ">Activities</button>
              </Link>
              <Link to="/Ganttchatv2">
                <button className="newButt ">View Gantt Chart</button>
              </Link>
            </div>
            <div className="final__bg__09 s__bggg">
              <div className="table__and__content">
                <div className="row">
                  <div className="col">
                    <div id="printableTable">
                      <table className="table">
                        <thead>
                          <tr className="tt__09">
                            <th></th>
                            <th>WBS ID</th>
                            <th>WBS Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {obsData?.map((row, index) => (
                            <React.Fragment key={row._id}>
                              <tr>
                                <td>
                                  <img
                                    src={icon__star}
                                    onClick={() => toggleExpandRow(index)}
                                    style={{ cursor: "pointer" }}
                                    alt="expand-icon"
                                  />
                                </td>
                                <td>{row.wbsId} </td>
                                <td>{row.wbsName}</td>
                                <td>{formatDate(row?.startDate)}</td>
                                <td>{formatDate(row.endDate)}</td>
                              </tr>

                              {expandedRows[index] && (
                                <tr
                                  className="s__098g45456"
                                  key={`${row.id}-child`}
                                >
                                  <td colSpan={6}>
                                    <table className="table">
                                      <tbody>
                                        {row.subWbs.map(
                                          (childRow, childIndex) => (
                                            <tr key={childRow._id}>
                                              <td className="border__09">
                                                <img
                                                  src={icon__star}
                                                  alt="child-icon"
                                                />
                                              </td>
                                              <td>{childRow.wbsId}</td>
                                              <td>{childRow.wbsName}</td>
                                              <td>
                                                {formatDate(childRow?.startDate)}
                                              </td>
                                              <td>
                                                {formatDate(childRow.endDate)}
                                                <Button
                                                  className="s__098001441"
                                                  onClick={() =>
                                                    removeChildRow(
                                                      index,
                                                      childIndex
                                                    )
                                                  }
                                                >
                                                  <DeleteOutlineIcon
                                                    onClick={() =>
                                                      handleDelete(childRow._id)
                                                    }
                                                  />
                                                </Button>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                        <Button
                                          className="s__listttgg"
                                          onClick={() => handleOpen(row._id)}
                                        >
                                          Add sub wbs
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
                    </div>
                    <Button onClick={handleOpen1}>Add WBS</Button>
                  </div>
                  {/* <div className="col-md-4">
                    <div className="s__098uhs">
                      <img src={calenddd} alt="child-icon" />
                    </div>
                  </div> */}
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
