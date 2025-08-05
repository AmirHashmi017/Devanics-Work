import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Leftsidebar from "./Leftsidebar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
import Offcanvas from "react-bootstrap/Offcanvas";
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
import { CalendarOutlined, EditFilled } from "@ant-design/icons";
import Header2 from "./Header2";

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

export default function Calender() {
  // Modal state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedObs = useSelector((state) => state.project.selectedObs);
  const [selected, setSelected] = useState("Resources");

  const tabs = ["Global", "Resources", "Project"];
  const [open, setOpen] = useState(false);
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const project = useSelector((state) => state.project.data);
  const [newProject, setNewProject] = useState({
    obsId: selectedObs?._id,
    userId: userData?._id,
    projectId: project?.projectId,
    projectStatus: project?.projectStatus,
    projectName: project?.projectName,
    owner: project?.owner,
    dueDate: project?.dueDate,
    startDate: project?.startDate,
    endDate: project?.enddate,
    manager: project?.assignManager,
    duration: project?.duration,
    endIn: project?.endIn,
    startIn: project?.startIn,
    eventExclude: "",
    eventExcludeName: "",
    SpecialEvents: [],
    dayExcudeArray: [],
    workingHours: "08",
    assignManager: project?.assignManager?.map((dr) => dr?._id),
    workingDaysPerWeek: 5, // Default to 5 working days per week
    workingHoursPerDay: {
      Monday: "08",
      Tuesday: "08",
      Wednesday: "08",
      Thursday: "08",
      Friday: "08",
      Saturday: "00", // Default Saturday and Sunday to 0
      Sunday: "00",
    },
  });
  const calendarEvents = useMemo(() => {
    return newProject?.SpecialEvents?.map((event, index) => ({
      id: String(index),
      title: event.name,
      start: event.date,
    }));
  }, [newProject.SpecialEvents]);
  useEffect(() => {
    const calculateDuration = () => {
      // Handle different date formats
      let startDate, endDate;
      
      // Check if startDate is in YYYYMMDD format (like 20250804)
      if (newProject?.startDate && typeof newProject.startDate === 'number') {
        const startStr = newProject.startDate.toString();
        if (startStr.length === 8) {
          // Convert YYYYMMDD to Date object
          const year = parseInt(startStr.substring(0, 4));
          const month = parseInt(startStr.substring(4, 6)) - 1; // Month is 0-indexed
          const day = parseInt(startStr.substring(6, 8));
          startDate = new Date(year, month, day);
        } else {
          startDate = new Date(newProject.startDate);
        }
      } else {
        startDate = new Date(newProject?.startDate);
      }
      
      // Check if endDate is a timestamp in milliseconds
      if (newProject?.endDate && typeof newProject.endDate === 'number') {
        if (newProject.endDate > 1000000000000) { // Likely a timestamp in milliseconds
          endDate = new Date(newProject.endDate);
        } else {
          const endStr = newProject.endDate.toString();
          if (endStr.length === 8) {
            // Convert YYYYMMDD to Date object
            const year = parseInt(endStr.substring(0, 4));
            const month = parseInt(endStr.substring(4, 6)) - 1; // Month is 0-indexed
            const day = parseInt(endStr.substring(6, 8));
            endDate = new Date(year, month, day);
          } else {
            endDate = new Date(newProject.endDate);
          }
        }
      } else {
        endDate = new Date(newProject.endDate);
      }

      // Validate dates
      if (!startDate || isNaN(startDate.getTime()) || !endDate || isNaN(endDate.getTime())) {
        console.warn('Invalid dates for duration calculation:', { startDate, endDate });
        return;
      }

      // Primavera-like working days calculation
      let totalWorkingDays = 0;
      const tempDate = new Date(startDate);
      
      // Get excluded days from the project configuration
      const excludedDays = newProject.dayExcudeArray?.map(item => 
        getDayIndexFromName(item.dayName)
      ) || [];

      // Define holidays (you can expand this list)
      const holidays = [
        // Add your holidays here, e.g.:
        // new Date(2025, 0, 1), // New Year's Day
        // new Date(2025, 6, 4), // Independence Day
        // etc.
      ];

      while (tempDate <= endDate) {
        const dayOfWeek = tempDate.getDay();
        const isExcludedDay = excludedDays.includes(dayOfWeek);
        const isHoliday = holidays.some(holiday => 
          holiday.getDate() === tempDate.getDate() &&
          holiday.getMonth() === tempDate.getMonth() &&
          holiday.getFullYear() === tempDate.getFullYear()
        );
        
        // Count as working day if not excluded and not a holiday
        if (!isExcludedDay && !isHoliday) {
          totalWorkingDays++;
        }
        
        tempDate.setDate(tempDate.getDate() + 1);
      }
      
      const calculatedWorkingDaysPerWeek = Object.values(
        prepareWorkingHoursData()
      ).filter((h) => h > 0).length;

      console.log('Primavera-like Duration calculation:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalWorkingDays,
        calculatedWorkingDaysPerWeek,
        excludedDays,
        holidays: holidays.length
      });

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
  ]);

  // Generate events for FullCalendar based on project start and end dates
  const generateEvents = () => {
    const events = [];
    const currentDate = new Date(newProject?.startDate);
    const endDate = new Date(newProject.endDate);

    while (currentDate <= endDate) {
      if (isWorkingDay(currentDate)) {
        events.push({
          title: "cherreerh",
          start: currentDate.toISOString().split("T")[0],
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return events;
  };

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
        // Remove the day from the excluded array (checkbox is checked)
        updatedDayExcludeArray = prevState.dayExcudeArray.filter(
          (item) => item.dayName !== day
        );
        // Restore default working hours for this day
        updatedWorkingHoursPerDay[day] = "08";
      } else {
        // Add the day to the excluded array (checkbox is unchecked)
        updatedDayExcludeArray = [
          ...prevState.dayExcudeArray,
          { dayName: day },
        ];
        // Set working hours to 0 for excluded days
        updatedWorkingHoursPerDay[day] = "00";
      }

      return {
        ...prevState,
        dayExcudeArray: updatedDayExcludeArray,
        workingHoursPerDay: updatedWorkingHoursPerDay,
      };
    });
  };
  // universalconstruction
  const handleBack = async () => {
    navigate("/universalconstruction?isOpen=true");
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

    Object.keys(dayMapping)?.forEach((day) => {
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

  const handleCreate = async (e) => {
    e.preventDefault();

    // Prepare the working hours data
    const workingHoursData = prepareWorkingHoursData();

    // Validate that at least one day has working hours
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
      return;
    }

    const projectData = {
      ...newProject,
      workingHours: workingHoursData,
    };

    try {
      const response = await axios.post(
        backend_url + "/createproject",
        projectData
      );
      Swal.fire("Success", "Project created successfully!", "success");
      console.log(response.data); // Handle the response as needed
      dispatch(
        setProjectData({
          ...response.data,
          toShowManager: project?.toShowManager,
        })
      );
      navigate("/Ganttchatv2");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "An error occurred",
        "error"
      );
      console.error(error); // Handle the error as needed
    }
  };

  const dayCellClassNames = (arg) => {
    const dayName = arg.date.toLocaleDateString("en-US", { weekday: "long" });
    const classes = [];

    // Get the current date, start date, and end date
    const currentDate = arg.date;
    const startDate = new Date(newProject?.startDate);
    const endDate = new Date(newProject.endDate);

    // Check if the day is within the project's duration
    if (currentDate >= startDate && currentDate <= endDate) {
      // Check if the day is excluded
      if (newProject.dayExcudeArray.some((item) => item.dayName === dayName)) {
        classes.push("excluded-day");
      } else {
        // Check if it's the current day
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
  const isWorkingDay = (date) => {
    const dayOfWeek = date.getDay();
    const excludedDays = newProject.dayExcudeArray.map((item) =>
      getDayIndexFromName(item.dayName)
    );
    return !excludedDays.includes(dayOfWeek);
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = newProject.SpecialEvents.filter(
      (_, i) => i !== index
    );
    setNewProject({ ...newProject, SpecialEvents: updatedEvents });
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div
        style={{
          backgroundColor: "orange",
          padding: "2px",
          borderRadius: "4px",
        }}
      >
        <b>{eventInfo.timeText}</b>
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
        <Header2 />
        <div className="mainpage !p-0 !max-h-[100vh] !overflow-y-auto">
          <div className="row !p-0 mb-16">
            {/* <Leftsidebar /> */}

            <div className="col-md-12 !pl-7 !pr-4 !my-4">
              {/* <Header /> */}
              <div className="final__bg__09 thenewfindsa !rounded-b-none">
                <div className="seaech__box___00">
                  <div className="row">
                    <div className="col-md-12 d-flex justify-between">
                      <div
                        className="s_09ssd"
                        style={{ paddingBottom: "20px" }}
                      >
                        {/* <h3>Create OBS</h3> */}
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
                        <Button className="!text-black text-center flex items-center justify-center gap-2">
                          <AddCircleIcon className="!w-4 !h-4 text-black" />
                          <div className="!text-black text-center mt-1">
                            Add
                          </div>
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

                    <div className="col-md-3 text-right"></div>
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

                                        {/* Dropdown for working hours */}
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
                                                setNewProject((prev) => ({
                                                  ...prev,
                                                  workingHoursPerDay: {
                                                    ...prev.workingHoursPerDay,
                                                    [day]: e.target.value,
                                                  },
                                                }))
                                              }
                                              disabled={!isChecked} // Disable dropdown if day is not checked
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
                    <div
                      className="tab-pane fade"
                      id="pills-profile"
                      role="tabpanel"
                      aria-labelledby="pills-profile-tab"
                      tabIndex="0"
                    >
                      <div className="thenavtabss2">Resources</div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-contact"
                      role="tabpanel"
                      aria-labelledby="pills-contact-tab"
                      tabIndex="0"
                    >
                      <div className="thenavtabss3">Projects</div>
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
                    className="thexformsd  mr-3 flex-wrap mb-10"
                    style={{ maxWidth: "100%" }}
                  >
                    <div className="theexinpps " style={{ maxWidth: "100%" }}>
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
                          onClick={() => {
                            if (
                              !newProject.eventExcludeName ||
                              !newProject.eventExclude
                            )
                              return;
                            const newSpecialEvent = {
                              name: newProject.eventExcludeName,
                              date: newProject.eventExclude,
                            };

                            setNewProject((prev) => ({
                              ...prev,
                              SpecialEvents: [
                                ...prev.SpecialEvents,
                                newSpecialEvent,
                              ],
                            }));
                            setNewProject((ps) => ({
                              ...ps,
                              eventExcludeName: "",
                              eventExclude: "",
                            }));
                          }}
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
                    className="thesubsbutons !h-[48px] !w-[177px] items-center mb-4 px-16 !py-3 !text-[14px]"
                    style={{ cursor: "pointer" }}
                    onClick={handleCreate}
                  >
                    Create
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="!my-5 opacity-0">k</div> */}
          </div>
        </div>

        {/* Modal for creating new project */}
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
