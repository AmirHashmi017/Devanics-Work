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
import gantrmappp from "../images/cdffv.jpg";
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
import { Link } from "react-router-dom";
import { backend_url } from "../constants/api";

export default function Ganttchatvtwo() {
  // new code above
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
    console.log(typeof window.externalFunction === "function", "herer");
    const element = document.getElementById("#workSpace");

    if (element) {
      element.remove();
    }
    if (typeof window.externalFunction === "function") {
      const result = window.externalFunction();
    }
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

  const [data, setData] = useState([
    {
      id: "1",
      wbsId: "2024",
      wbsName: " Builder Property",
      originalDuration: "23",
      status: "In Progress",
      startDate: "2023-01-01",

      childRows: [
        {
          id: "1.1",
          wbsId: "ID1",
          wbsName: "Task 1",
          originalDuration: "25 ",
          status: "Completed",
          startDate: "2023-01-10",
        },
        {
          id: "1.2",
          wbsId: "ID1",
          wbsName: "Task 2",
          originalDuration: "45 ",
          status: "In Progress",
          startDate: "2023-02-01",
        },
        {
          id: "1.2",
          wbsId: "ID1",
          wbsName: "Task 2",
          originalDuration: "87 ",
          status: "In Progress",
          startDate: "2023-02-01",
        },
        {
          id: "1.2",
          wbsId: "ID1",
          wbsName: "Task 2",
          originalDuration: "32 ",
          status: "In Progress",
          startDate: "2023-02-01",
        },
      ],
    },
    {
      id: "2",
      wbsId: "2024",
      wbsName: " Builder Property",
      originalDuration: "23",
      status: "In Progress",
      startDate: "2023-01-01",

      childRows: [
        {
          id: "1.2",
          wbsId: "ID1",
          wbsName: "Task 2",
          originalDuration: "32 ",
          status: "In Progress",
          startDate: "2023-02-01",
        },
      ],
    },
  ]);

  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

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
        originalDuration: "",
        status: "",
        startDate: "",

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
        originalDuration: "",
        status: "",
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

  return (
    <>
      <Header />
      <div className="mainpage">
        <div className="row">
          <div className="col-md-1">
            <Leftsidebar />
          </div>

          <div className="col-md-11">
            <div className="main_nav_menu">
              <Link to="/wbs">
                <button className="newButt ">WBS</button>
              </Link>
              <Link to="/Ganttchatv">
                <button className="newButt ">Activities</button>
              </Link>
              <Link to="/Ganttchatv2">
                <button className="newButt newButt_active ">
                  View Gantt Chart
                </button>
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <div
                onClick={() => {
                  // Don't use saveProject() to avoid clone errors
                  console.log("Current tasks:", window.ge?.tasks);
                }}
                id="workSpace"
                style={{
                  padding: "0px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  border: "1px solid #e5e5e5",
                  position: "relative",
                  margin: "0 5px",
                  // width: "100%",
                  // minHeight: "100vh",
                  background: "white",
                }}
              ></div>
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
