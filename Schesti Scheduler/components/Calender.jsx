import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Leftsidebar from "./Leftsidebar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { backend_url_core } from "../constants/api";
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
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { setProjectData } from "./redux/projectSlice";
import { MdDeleteOutline } from "react-icons/md";
import { backend_url } from "../constants/api";
import { DatePicker, Input } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Default global calendar
const defaultGlobalCalendar = {
  workingHours: {
    monday: 8,
    tuesday: 8,
    wednesday: 8,
    thursday: 8,
    friday: 8,
    saturday: 0,
    sunday: 0,
  },
  dayExcudeArray: [{ dayName: "Saturday" }, { dayName: "Sunday" }],
  SpecialEvents: [],
};

export default function Calender() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const selectedObs = useSelector((state) => state.project.selectedObs);
  const project = useSelector((state) => state.project.data);
  const [selected, setSelected] = useState("Project");
  const tabs = ["Global", "Project"];
  const [open, setOpen] = useState(false);
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [globalCalendar, setGlobalCalendar] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  // Initialize newProject with existing project data or global calendar
  const [newProject, setNewProject] = useState({
    obsId: selectedObs?._id,
    userId: userData?._id,
    projectId: project?.projectId,
    projectStatus: project?.projectStatus || "Pending",
    projectName: project?.projectName || "",
    owner: project?.owner || "",
    dueDate: project?.dueDate || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    manager: project?.assignManager || [],
    duration: project?.duration || 0,
    endIn: project?.endIn || "",
    startIn: project?.startIn || "",
    eventExclude: "",
    eventExcludeName: "",
    SpecialEvents: project?.SpecialEvents || [],
    dayExcudeArray: project?.dayExcudeArray || [],
    workingHours: project?.workingHours?.dailyHours || defaultGlobalCalendar.workingHours,
    assignManager: project?.assignManager?.map((dr) => dr?._id) || [],
    workingDaysPerWeek: project?.workingHours?.workingDays?.length || 5,
    workingHoursPerDay: {
      Monday: project?.workingHours?.dailyHours?.monday
        ? String(project.workingHours.dailyHours.monday).padStart(2, "0")
        : "08",
      Tuesday: project?.workingHours?.dailyHours?.tuesday
        ? String(project.workingHours.dailyHours.tuesday).padStart(2, "0")
        : "08",
      Wednesday: project?.workingHours?.dailyHours?.wednesday
        ? String(project.workingHours.dailyHours.wednesday).padStart(2, "0")
        : "08",
      Thursday: project?.workingHours?.dailyHours?.thursday
        ? String(project.workingHours.dailyHours.thursday).padStart(2, "0")
        : "08",
      Friday: project?.workingHours?.dailyHours?.friday
        ? String(project.workingHours.dailyHours.friday).padStart(2, "0")
        : "08",
      Saturday: project?.workingHours?.dailyHours?.saturday
        ? String(project.workingHours.dailyHours.saturday).padStart(2, "0")
        : "00",
      Sunday: project?.workingHours?.dailyHours?.sunday
        ? String(project.workingHours.dailyHours.sunday).padStart(2, "0")
        : "00",
    },
  });

  const isUpdate = !!project?.workingHours;

  const calendarEvents = useMemo(() => {
    return (selected === "Global" ? globalCalendar?.SpecialEvents : newProject?.SpecialEvents)?.map(
      (event, index) => ({
        id: String(index),
        title: event.name,
        start: event.date,
      })
    ) || [];
  }, [newProject.SpecialEvents, globalCalendar, selected]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user._id);
      const fetchUserDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${backend_url_core}/api/user/userdetails`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserDetails(response.data);
        } catch (err) {
          console.error("Error fetching user details:", err);
          Swal.fire("Error", "Failed to fetch user details", "error");
        }
      };
      fetchUserDetails();
    }
  }, []);

  // Fetch global calendar when "Global" tab is selected
  useEffect(() => {
    if (selected === "Global") {
      const fetchGlobalCalendar = async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          const response = await axios.get(`${backend_url}/calendar/${user._id}`);
          setGlobalCalendar(response.data);
          // Update newProject with global calendar data for UI
          setNewProject((prev) => ({
            ...prev,
            workingHours: response.data.workingHours?.dailyHours || defaultGlobalCalendar.workingHours,
            dayExcudeArray: response.data.dayExcudeArray || defaultGlobalCalendar.dayExcudeArray,
            SpecialEvents: response.data.SpecialEvents || defaultGlobalCalendar.SpecialEvents,
            workingHoursPerDay: {
              Monday: String(response.data.workingHours?.dailyHours?.monday || 8).padStart(2, "0"),
              Tuesday: String(response.data.workingHours?.dailyHours?.tuesday || 8).padStart(2, "0"),
              Wednesday: String(response.data.workingHours?.dailyHours?.wednesday || 8).padStart(2, "0"),
              Thursday: String(response.data.workingHours?.dailyHours?.thursday || 8).padStart(2, "0"),
              Friday: String(response.data.workingHours?.dailyHours?.friday || 8).padStart(2, "0"),
              Saturday: String(response.data.workingHours?.dailyHours?.saturday || 0).padStart(2, "0"),
              Sunday: String(response.data.workingHours?.dailyHours?.sunday || 0).padStart(2, "0"),
            },
          }));
        } catch (err) {
          if (err.response?.status === 404) {
            // No global calendar found, use default
            setGlobalCalendar(defaultGlobalCalendar);
            setNewProject((prev) => ({
              ...prev,
              workingHours: defaultGlobalCalendar.workingHours,
              dayExcudeArray: defaultGlobalCalendar.dayExcudeArray,
              SpecialEvents: defaultGlobalCalendar.SpecialEvents,
              workingHoursPerDay: {
                Monday: "08",
                Tuesday: "08",
                Wednesday: "08",
                Thursday: "08",
                Friday: "08",
                Saturday: "00",
                Sunday: "00",
              },
            }));
          } else {
            console.error("Error fetching global calendar:", err);
            Swal.fire("Error", "Failed to fetch global calendar", "error");
          }
        }
      };
      fetchGlobalCalendar();
    }
    else if (selected === "Project") {
    // Reset newProject to project-specific calendar data
    setNewProject((prev) => ({
      ...prev,
      workingHours: project?.workingHours?.dailyHours || defaultGlobalCalendar.workingHours,
      dayExcudeArray: project?.dayExcudeArray || defaultGlobalCalendar.dayExcudeArray,
      SpecialEvents: project?.SpecialEvents || defaultGlobalCalendar.SpecialEvents,
      workingHoursPerDay: {
        Monday: project?.workingHours?.dailyHours?.monday
          ? String(project.workingHours.dailyHours.monday).padStart(2, "0")
          : "08",
        Tuesday: project?.workingHours?.dailyHours?.tuesday
          ? String(project.workingHours.dailyHours.tuesday).padStart(2, "0")
          : "08",
        Wednesday: project?.workingHours?.dailyHours?.wednesday
          ? String(project.workingHours.dailyHours.wednesday).padStart(2, "0")
          : "08",
        Thursday: project?.workingHours?.dailyHours?.thursday
          ? String(project.workingHours.dailyHours.thursday).padStart(2, "0")
          : "08",
        Friday: project?.workingHours?.dailyHours?.friday
          ? String(project.workingHours.dailyHours.friday).padStart(2, "0")
          : "08",
        Saturday: project?.workingHours?.dailyHours?.saturday
          ? String(project.workingHours.dailyHours.saturday).padStart(2, "0")
          : "00",
        Sunday: project?.workingHours?.dailyHours?.sunday
          ? String(project.workingHours.dailyHours.sunday).padStart(2, "0")
          : "00",
      },
    }));
  }
  }, [selected, userId, project]);

  useEffect(() => {
    const calculateDuration = () => {
      let startDate, endDate;

      if (newProject?.startDate && typeof newProject.startDate === "number") {
        const startStr = newProject.startDate.toString();
        if (startStr.length === 8) {
          const year = parseInt(startStr.substring(0, 4));
          const month = parseInt(startStr.substring(4, 6)) - 1;
          const day = parseInt(startStr.substring(6, 8));
          startDate = new Date(year, month, day);
        } else {
          startDate = new Date(newProject.startDate);
        }
      } else {
        startDate = new Date(newProject?.startDate);
      }

      if (newProject?.endDate && typeof newProject.endDate === "number") {
        if (newProject.endDate > 1000000000000) {
          endDate = new Date(newProject.endDate);
        } else {
          const endStr = newProject.endDate.toString();
          if (endStr.length === 8) {
            const year = parseInt(endStr.substring(0, 4));
            const month = parseInt(endStr.substring(4, 6)) - 1;
            const day = parseInt(endStr.substring(6, 8));
            endDate = new Date(year, month, day);
          } else {
            endDate = new Date(newProject.endDate);
          }
        }
      } else {
        endDate = new Date(newProject.endDate);
      }

      if (!startDate || isNaN(startDate.getTime()) || !endDate || isNaN(endDate.getTime())) {
        console.warn("Invalid dates for duration calculation:", { startDate, endDate });
        return;
      }

      let totalWorkingDays = 0;
      const tempDate = new Date(startDate);
      const excludedDays = newProject.dayExcudeArray?.map((item) =>
        getDayIndexFromName(item.dayName)
      ) || [];

      const holidays = newProject.SpecialEvents.map((event) => new Date(event.date));

      while (tempDate <= endDate) {
        const dayOfWeek = tempDate.getDay();
        const isExcludedDay = excludedDays.includes(dayOfWeek);
        const isHoliday = holidays.some(
          (holiday) =>
            holiday.getDate() === tempDate.getDate() &&
            holiday.getMonth() === tempDate.getMonth() &&
            holiday.getFullYear() === tempDate.getFullYear()
        );

        if (!isExcludedDay && !isHoliday) {
          totalWorkingDays++;
        }

        tempDate.setDate(tempDate.getDate() + 1);
      }

      const calculatedWorkingDaysPerWeek = Object.values(
        prepareWorkingHoursData()
      ).filter((h) => h > 0).length;

      setNewProject((prev) => ({
        ...prev,
        duration: totalWorkingDays,
        workingDaysPerWeek: calculatedWorkingDaysPerWeek,
      }));
    };

    calculateDuration();
  }, [
    newProject?.startDate,
    newProject.endDate,
    newProject.dayExcudeArray,
    newProject.workingHoursPerDay,
    newProject.SpecialEvents,
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (day) => {
    setNewProject((prevState) => {
      const dayExists = prevState.dayExcudeArray.some(
        (item) => item.dayName === day
      );

      let updatedDayExcludeArray;
      let updatedWorkingHoursPerDay = { ...prevState.workingHoursPerDay };

      if (dayExists) {
        updatedDayExcludeArray = prevState.dayExcudeArray.filter(
          (item) => item.dayName !== day
        );
        updatedWorkingHoursPerDay[day] = "08";
      } else {
        updatedDayExcludeArray = [
          ...prevState.dayExcudeArray,
          { dayName: day },
        ];
        updatedWorkingHoursPerDay[day] = "00";
      }

      // Update globalCalendar if in Global tab
      if (selected === "Global") {
        setGlobalCalendar((prev) => ({
          ...prev,
          dayExcudeArray: updatedDayExcludeArray,
          workingHours: {
            ...prev.workingHours,
            [day.toLowerCase()]: parseInt(updatedWorkingHoursPerDay[day]),
          },
        }));
      }

      return {
        ...prevState,
        dayExcudeArray: updatedDayExcludeArray,
        workingHoursPerDay: updatedWorkingHoursPerDay,
      };
    });
  };

  const handleAddHoliday = () => {
    if (!newProject.eventExcludeName || !newProject.eventExclude) {
      Swal.fire("Error", "Please provide both holiday name and date", "error");
      return;
    }

    const newSpecialEvent = {
      name: newProject.eventExcludeName,
      date: newProject.eventExclude,
    };

    setNewProject((prev) => ({
      ...prev,
      SpecialEvents: [...prev.SpecialEvents, newSpecialEvent],
      eventExcludeName: "",
      eventExclude: "",
    }));

    // Update globalCalendar if in Global tab
    if (selected === "Global") {
      setGlobalCalendar((prev) => ({
        ...prev,
        SpecialEvents: [...(prev?.SpecialEvents || []), newSpecialEvent],
      }));
    }
  };

  const handleBack = () => {
    if (isUpdate) {
      navigate("/Ganttchatv2");
    } else {
      navigate("/universalconstruction?isOpen=true");
    }
  };

  const prepareWorkingHoursData = () => {
    const workingHours = {};
    const dayMapping = {
      Monday: "monday",
      Tuesday: "tuesday",
      Wednesday: "wednesday",
      Thursday: "thursday",
      Friday: "friday",
      Saturday: "saturday",
      Sunday: "sunday",
    };

    Object.keys(dayMapping).forEach((day) => {
      const isExcluded = newProject.dayExcudeArray.some(
        (item) => item.dayName === day
      );
      const hours = isExcluded
        ? 0
        : parseInt(newProject.workingHoursPerDay[day] || "08");
      workingHours[dayMapping[day]] = hours;
    });

    return workingHours;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state

    const workingHoursData = prepareWorkingHoursData();
    const totalHours = Object.values(workingHoursData).reduce(
      (sum, hours) => sum + hours,
      0
    );

    if (totalHours === 0) {
      Swal.fire(
        "Error",
        "At least one working day must be selected with hours greater than 0!",
        "error"
      );
      setIsLoading(false);
      return;
    }

    const calendarData = {
      workingHours: workingHoursData,
      dayExcudeArray: newProject.dayExcudeArray,
      SpecialEvents: newProject.SpecialEvents,
    };

    try {
      let response;
      const token = localStorage.getItem("token");
      if (selected === "Global") {
        // Handle global calendar
        const user = JSON.parse(localStorage.getItem("user"));
          response = await axios.post(`${backend_url}/calendar/${user._id}`, calendarData);
         
        setGlobalCalendar(response.data);
        const projectData = {
            ...newProject,
            workingHours: workingHoursData,
            dayExcudeArray: newProject.dayExcudeArray,
            SpecialEvents: newProject.SpecialEvents,
            assignManager: newProject.assignManager || [],
          };
        // Update the current project's calendar to match the global calendar
        if (project?._id) {
          
          const projectResponse = await axios.put(
            `${backend_url}/updateproject/${project._id}`,
            projectData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire("Success", "Project calendar updated to match global calendar!", "success");
          dispatch(
            setProjectData({
              ...projectResponse.data,
              toShowManager: project?.toShowManager,
            })
          );
        }
        else {
        // Create new project with global calendar data
        const projectResponse = await axios.post(
          `${backend_url}/createproject`,
          projectData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Success", "Project created with global calendar settings!", "success");
        dispatch(
          setProjectData({
            ...projectResponse.data,
            toShowManager: project?.toShowManager,
          })
        );
      }
    }
       else {
        // Handle project calendar
        const projectData = {
          ...newProject,
          workingHours: workingHoursData,
          assignManager: newProject.assignManager || [],
        };
        if (isUpdate) {
          response = await axios.put(
            `${backend_url}/updateproject/${project._id}`,
            projectData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire("Success", "Project updated successfully!", "success");
        } else {
          response = await axios.post(
            `${backend_url}/createproject`,
            projectData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire("Success", "Project created successfully!", "success");
        }
        dispatch(
          setProjectData({
            ...response.data,
            toShowManager: project?.toShowManager,
          })
        );
      }
      navigate("/Ganttchatv2");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "An error occurred",
        "error"
      );
      console.error(error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const dayCellClassNames = (arg) => {
    const dayName = arg.date.toLocaleDateString("en-US", { weekday: "long" });
    const classes = [];

    const currentDate = arg.date;
    const startDate = new Date(newProject?.startDate);
    const endDate = new Date(newProject.endDate);

    if (currentDate >= startDate && currentDate <= endDate) {
      if (newProject.dayExcudeArray.some((item) => item.dayName === dayName)) {
        classes.push("excluded-day");
      } else {
        if (currentDate.toDateString() === new Date().toDateString()) {
          classes.push("current-day");
        } else {
          classes.push("working-day");
        }
      }
    } else {
      classes.push("non-working-day");
    }

    return classes.join(" ");
  };

  const getDayIndexFromName = (dayName) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days.indexOf(dayName);
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = newProject.SpecialEvents.filter((_, i) => i !== index);
    setNewProject({ ...newProject, SpecialEvents: updatedEvents });
    if (selected === "Global") {
      setGlobalCalendar((prev) => ({
        ...prev,
        SpecialEvents: updatedEvents,
      }));
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div
        style={{
          backgroundColor: "orange",
          padding: "2px",
          textAlign: "center",
          borderRadius: "4px",
          maxWidth: "100%",
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflow: "hidden",
          fontSize: "12px",
        }}
      >
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  const HOVERED_MARGIN_LEFT = "ml-[240px]";
  const UNHOVERED_MARGIN_LEFT = "ml-[80px]";
  const [isOpened, setisOpened] = useState(true);

  const toggleCollapsed = () => {
    setisOpened(!isOpened);
  };

  const handleEventClick = async (clickInfo) => {
    const eventTitle = clickInfo.event.title;
    const eventIndex = parseInt(clickInfo.event.id, 10);

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete the event: "${eventTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (confirmResult.isConfirmed) {
      try {
        handleDeleteEvent(eventIndex);
        Swal.fire("Success", "Event deleted successfully.", "success");
      } catch (error) {
        console.error("Failed to delete event:", error);
        Swal.fire("Error", "Failed to delete event.", "error");
      }
    }
  };

  return (
    <>
      <Leftsidebar isOpened={isOpened} toggleCollapsed={toggleCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpened ? HOVERED_MARGIN_LEFT : UNHOVERED_MARGIN_LEFT
        }`}
      >
        <Navbar user={userDetails || {}} />
        <div className="mainpage !p-0 !max-h-[100vh] !overflow-y-auto">
          <div className="row !p-0 mb-16">
            <div className="col-md-12 !pl-7 !pr-4 !my-4">
              <div className="final__bg__09 thenewfindsa !rounded-b-none">
                <div className="seaech__box___00">
                  <div className="row">
                    <div className="col-md-12 d-flex justify-between">
                      <div
                        className="s_09ssd"
                        style={{ paddingBottom: "20px" }}
                      >
                        <h3 className="!text-[#007AB6] !text-[28px]">
                          Set Your Calendar
                        </h3>
                      </div>
                      <div className="text-center items-center justify-center flex gap-2">
                        {tabs.map((tab) => {
                          const isSelected = selected === tab;
                          return (
                            <Button
                              key={tab}
                              onClick={() => setSelected(tab)}
                              className={`px-4 py-2 rounded border font-medium transition
                ${
                  isSelected
                    ? "!bg-[#007AB6] !text-white !border-[#007AB6]"
                    : "!bg-white !text-[#007AB6] !border-[#007AB6] hover:!bg-blue-50"
                }`}
                            >
                              {tab}
                            </Button>
                          );
                        })}
                      </div>
                      <div className="text-center items-center justify-center gap-1 flex">
                        <Button
                          className="!text-black text-center flex items-center justify-center gap-2"
                          onClick={handleOpen}
                        >
                          <AddCircleIcon className="!w-4 !h-4 text-black" />
                          <div className="!text-black text-center mt-1">Add</div>
                        </Button>
                        <Button className="!text-black text-center flex items-center justify-center gap-2">
                          <DeleteIcon className="!w-4 !h-4 text-black" />
                          <div className="!text-black text-center mt-1">
                            Delete
                          </div>
                        </Button>
                        <Button className="!text-black text-center flex items-center justify-center gap-2">
                          <CalendarOutlined className="!w-4 !h-4 text-black" />
                          <div className="!text-black text-center mt-1">
                            Modify
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="full__calll !mt-0 !rounded-t-none !px-[26px]">
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                      tabIndex="0"
                    >
                      <div className="thenavtabss1">
                        <div className="row">
                          <div className="col-md-9">
                            <div
                              className="thecalenders"
                              style={{ maxHeight: "471px" }}
                            >
                              <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                weekends={true}
                                events={calendarEvents}
                                eventClick={handleEventClick}
                                eventContent={renderEventContent}
                                dayCellClassNames={dayCellClassNames}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="thecalecheckboxx">
                              <div className="theworkingsdheads">
                                <h3>Working Days & Hours</h3>
                              </div>
                              <div className="thhecheckworks flex flex-col gap-2 w-full">
                                <ul className="thecheclnoxuls w-full">
                                  {[
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday",
                                  ].map((day) => {
                                    const isChecked =
                                      !newProject.dayExcudeArray.some(
                                        (item) => item.dayName === day
                                      );

                                    return (
                                      <li
                                        key={day}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 my-4 rounded w-full"
                                      >
                                        <label
                                          htmlFor={`checkbox-${day}`}
                                          className="flex items-center gap-3 cursor-pointer sm:w-[70%] border px-4 py-[0.6rem] rounded w-full"
                                        >
                                          <input
                                            type="checkbox"
                                            id={`checkbox-${day}`}
                                            checked={isChecked}
                                            onChange={() =>
                                              handleCheckboxChange(day)
                                            }
                                            className="cursor-pointer"
                                          />
                                          <span className="text-sm">{day}</span>
                                        </label>
                                        <div className="w-full sm:w-[30%]">
                                          <FormControl fullWidth>
                                            <Select
                                              sx={{ borderRadius: "10px" }}
                                              value={
                                                newProject.workingHoursPerDay[
                                                  day
                                                ] || "00"
                                              }
                                              onChange={(e) =>
                                                setNewProject((prev) => {
                                                  const updatedHours = {
                                                    ...prev.workingHoursPerDay,
                                                    [day]: e.target.value,
                                                  };
                                                  // Update globalCalendar if in Global tab
                                                  if (selected === "Global") {
                                                    setGlobalCalendar((prevGlobal) => ({
                                                      ...prevGlobal,
                                                      workingHours: {
                                                        ...prevGlobal.workingHours,
                                                        [day.toLowerCase()]: parseInt(e.target.value),
                                                      },
                                                    }));
                                                  }
                                                  return {
                                                    ...prev,
                                                    workingHoursPerDay: updatedHours,
                                                  };
                                                })
                                              }
                                              disabled={!isChecked}
                                            >
                                              {[
                                                "00",
                                                "01",
                                                "02",
                                                "03",
                                                "04",
                                                "05",
                                                "06",
                                                "07",
                                                "08",
                                                "09",
                                              ].map((hour) => (
                                                <MenuItem
                                                  key={hour}
                                                  value={hour}
                                                >
                                                  {hour}
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="theeeseconds w-full">
                <div
                  className="col-12 "
                  style={{ zIndex: "22222222222222222222222222222" }}
                >
                  <div className="theexholsdheads mt-4">
                    <h2 className="text-[#344054] !text-[16px]">
                      Exceptional Holidays
                    </h2>
                  </div>
                  <div
                    className="thexformsd mr-3 flex-wrap mb-10"
                    style={{ maxWidth: "100%" }}
                  >
                    <div className="theexinpps" style={{ maxWidth: "100%" }}>
                      <label className="!text-[#344054] !text-[14px]">
                        Name of the Holiday
                      </label>
                      <Input
                        className="!p-2 !mt-[10px]"
                        value={newProject.eventExcludeName}
                        placeholder="Name of Holiday"
                        name="eventExcludeName"
                        size="large"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="theexinpps" style={{ maxWidth: "100%" }}>
                      <label className="!text-[#344054] !text-[14px]">
                        Select Date
                      </label>
                      <DatePicker
                        size="large"
                        className="!mt-[10px]"
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        onChange={(date, dateString) => {
                          setNewProject((prev) => ({
                            ...prev,
                            eventExclude: dateString,
                          }));
                        }}
                      />
                    </div>
                    <div className="theexinpps mb-2 mx-3">
                      <div
                        className="thesubsbutons !mt-[10px]"
                        style={{ cursor: "pointer" }}
                        onClick={handleAddHoliday}
                      >
                        Add
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="theeeseconds w-full py-4">
                <div className="theexcpemains flex gap-4 items-center justify-center align-middle">
                  <div
                    className="thesubsbutons !h-[48px] !w-[177px] items-center mb-4 !bg-gray-100 !text-strongBlue"
                    style={{ cursor: "pointer" }}
                    onClick={handleBack}
                  >
                    Back
                  </div>
                  <div
                    className={`thesubsbutons !h-[48px] !w-[177px] items-center mb-4 px-16 !py-3 !text-[14px] ${
                      isLoading ? "!bg-gray-400 !cursor-not-allowed" : ""
                    }`}
                    style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                    onClick={isLoading ? null : handleSubmit}
                  >
                    {isLoading
                      ? isUpdate || globalCalendar
                        ? "Saving..."
                        : "Creating..."
                      : isUpdate || globalCalendar
                      ? "Save"
                      : "Create"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-title" variant="h6" component="h2">
              Create New Project
            </Typography>
            <TextField
              margin="dense"
              name="projectNumber"
              label="Project Number"
              type="text"
              fullWidth
              value={newProject.projectNumber}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="projectName"
              label="Project Name"
              type="text"
              fullWidth
              value={newProject.projectName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="managingCompany"
              label="Managing Company"
              type="text"
              fullWidth
              value={newProject.managingCompany}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="ownerRepresentative"
              label="Owner Representative"
              type="text"
              fullWidth
              value={newProject.ownerRepresentative}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Due Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="task"
              label="Task"
              type="text"
              fullWidth
              value={newProject.task}
              onChange={handleChange}
            />
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={newProject.status}
              fullWidth
              onChange={handleChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
            <TextField
              margin="dense"
              name="category"
              label="Category"
              type="text"
              fullWidth
              value={newProject.category}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={newProject.description}
              onChange={handleChange}
            />
            <Button color="primary">Create</Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}