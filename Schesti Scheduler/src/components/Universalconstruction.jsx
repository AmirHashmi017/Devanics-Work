import React, { useEffect, useState } from "react";
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
  Slide,
  FormControl,
  InputLabel,
} from "@mui/material";
import create_icon from "../images/newframe.svg";
import userimg from "../images/Avatar.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import create_icon2 from "../images/newframe2.svg";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useSelector } from "react-redux";
import moment from "moment";
import { setProjectData, setSelectedOBS } from "./redux/projectSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { MdDeleteOutline } from "react-icons/md";
import { backend_url, backend_url_core } from "../constants/api";
import CustomButton from "./CustomButton";
import plussvg from "../images/plus.svg";
import { CloseOutlined, PlusOutlined, XOutlined } from "@ant-design/icons";
import { Select as AntSelect, DatePicker, Input } from "antd";
import { getStatusClassNames } from "antd/es/_util/statusUtils";
import statuses from "../constants/statuses";
import Header2 from "./Header2";

const bg_style = "rounded-xl bg-snowWhite shadow-secondaryTwist";
const BACKEND_URL = "http://localhost:5000/backend";
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function formatDate(date) {
  let d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
const toInt = function (date) {
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
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

// Function to calculate working days between two dates (Primavera-like)
const calculateWorkingDays = (startDate, endDate, excludedDays = []) => {
  let totalWorkingDays = 0;
  const tempDate = new Date(startDate);
  
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
  
  return totalWorkingDays;
};
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export default function Universalconstruction() {
  // Modal state
  const [searchParams] = useSearchParams();
  const isOpen = searchParams.get("isOpen");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedObs = useSelector((state) => state.project.selectedObs);
  const project = useSelector((state) => state.project.data);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    by: "",
    profileImage: "",
  });
  const [obsData, setObsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [selectedUserTemp, setSelectedUserTemp] = useState(null);
  const [actionMenuOpenUserId, setActionMenuOpenUserId] = useState(null);
  const userRoles = [
    { label: "Admin", value: "Admin" },
    { label: "Company", value: "Company" },
    { label: "Project Manager", value: "Project Manager" },
    { label: "Sales Manager", value: "Sales Manager" },
    { label: "Estimator", value: "Estimator" },
    { label: "Accounts Manager", value: "Accounts Manager" },
    { label: "Subcontractor", value: "Subcontractor" },
  ];
  const handleSelectUser = (userIds) => {
    for (let userId in userIds) {
      const user = users.find((user) => user._id === userId);

      if (
        user &&
        !selectedUsers.some((selectedUser) => selectedUser._id === userId)
      ) {
        setSelectedUsers([...selectedUsers, user]);
        setNewProject({
          ...newProject,
          assignManager: [...selectedUsers, user],
          toShowManager: [...selectedUsers, user],
        });
      }
    }
  };
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(backend_url + `/update-role/${userId}`, {
        role: newRole,
      });
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      Swal.fire("Status changed successfully!", "", "success");
    } catch (error) {
      Swal.fire("Error updating user role:", "", "error");
      console.error("Error updating user role:", error);
    }
  };
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(
        // backend_url_core+`/api/user/users/${user?._id}`
        backend_url_core + `/api/user/users?page=1&limit=1000&queryRoles=`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data, " ===> users response");
      setUsers(response.data?.data?.employees);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadings(false);
    }
  };
  useEffect(() => {
    setNewProject({ ...newProject, obsSelect: selectedObs?.organization });
  }, [selectedObs]);
  useEffect(() => {
    // Fetch users created by the specific creator

    fetchUsers();
  }, []);
  useEffect(() => {
    if (isOpen) {
      setOpen(true);
      setNewProject({
        obsSelect: selectedObs?.organization,
        projectId: project?.projectId ?? "",
        projectName: project?.projectName ?? "",
        owner: project?.owner ?? "",
        duration: project?.duration ?? "",
        dueDate: project?.dueDate ?? "",
        projectStatus: project?.projectStatus ?? "STATUS_WAITING",
        startIn: project?.startIn ?? new Date().getTime(),
        startdate: project?.startDate ?? formatDate(new Date()),
        endIn: project?.endIn ?? "",
        enddate: project?.enddate ?? "",
        assignManager: project?.assignManager?.map((dr) => dr?._id) ?? [],
        toShowManager: [],
      });
      handleSelectUser(project?.assignManager?.map((dr) => dr?._id) ?? []);
    }
  }, [isOpen]);
  useEffect(() => {
    const fetchObsData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios.get(
          backend_url + "/allObs" + `/${user?._id}`
        );
        setObsData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        Swal.fire("Error", "Failed to fetch OBS data", "error");
      }
    };

    fetchObsData();
  }, []);
  const [newProject, setNewProject] = useState({
    obsSelect: selectedObs?.organization,
    projectId: "",
    projectName: "",
    owner: "",
    duration: "",
    dueDate: "",
    projectStatus: "STATUS_WAITING",
    startIn: new Date().getTime(),
    startdate: formatDate(new Date()),
    endIn: "",
    enddate: "",
    assignManager: [],
    toShowManager: [],
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };
  const handleAntdChange = (name, value) => {
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateNewUser = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const { name, profileImage } = newUser;

      // Create FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("createdBy", user?._id);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // Make Axios POST request
      const response = await axios.post(
        backend_url + "/create-new-user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOpen1(false);
      Swal.fire("User added successfully!", "", "success");
      console.log("User created successfully:", response.data.user);
      fetchUsers();
      // Handle success as needed, e.g., show a success message
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire("Error creating user:", "", "error");
      // Handle error, e.g., show an error message
    }
  };
  const handleCreate = () => {
    console.log(newProject);
    dispatch(setProjectData(newProject));
    navigate("/calender");
    handleClose();
  };
  const handleSelect = (value) => {
    setNewProject((prevState) => ({
      ...prevState, // spread the previous state
      obsSelect: value, // update obsSelect with your new value
    }));
  };
  const handleDelete = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };
  const HOVERED_MARGIN_LEFT = "ml-[240px]";
  const UNHOVERED_MARGIN_LEFT = "ml-[80px]";
  const [isOpened, setisOpened] = useState(true);
  const [showAi, setshowAi] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const toggleCollapsed = () => {
    setisOpened(!isOpened);
  };
  useEffect(() => {
    console.log(newProject, " ===> New Project Here");
  }, [newProject]);
  return (
    <>
      <Leftsidebar isOpened={isOpened} toggleCollapsed={toggleCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpened ? HOVERED_MARGIN_LEFT : UNHOVERED_MARGIN_LEFT
        }`}
      >
        <Header2 />
        <div className={`${bg_style} m-5 h-[75vh] flex justify-center `}>
          {showAi ? (
            <div className="flex flex-col gap-y-3 items-center justify-center !w-full h-full">
              {/* <div className="text-center font-inter font-light text-[14px] text-[#667085]  break-words w-[40%] leading-[22px] tracking-wider">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis,
          eveniet. Iste earum necessitatibus quibusdam minima alias
          sapiente, modi nostrum temporibus.
        </div> */}
              <Button
                className="!text-white bg-lavenderPurpleReplica font-bold hover:!text-white hover:!bg-lavenderPurpleReplica"
                size="large"
              >
                Coming Soon
              </Button>
              <Button
                className="font-bold"
                size="middle"
                onClick={() => {
                  setshowAi(false);
                }}
              >
                Back
              </Button>
            </div>
          ) : (
            <div className="flex justify-between w-[90%] ">
              <div className="h-[80%] w-[45%]  flex justify-center flex-col items-center rounded-3xl my-3">
                <div className="h-[50%] flex items-end">
                  <div className="p-8 bg-gray-100 rounded-full mb-5">
                    <img width={85} height={80} src={create_icon} alt="" />
                  </div>
                </div>
                <div className="h-[50%] flex flex-col items-center gap-3 pt-12">
                  <div className="font-semibold font-inter text-[20px] leading-[34px] tracking-wide text-[#181818]">
                    Upload Your Drawings & Documents
                  </div>
                  <div className="text-center font-inter font-light text-[14px] text-[#667085]  break-words w-[90%] leading-[22px] tracking-wider">
                    Submit your project drawings and construction documents here
                    for review or collaboration. Ensure all files are in PDF,
                    DWG, or other compatible formats.
                  </div>
                  {/* <button
                    disabled={isLoading}
                    onClick={() => {
                      makeApiCall();
                    }}
                    className="cursor-pointer mt-5 w-[60%] bg-lavenderPurpleReplica rounded-md text-white p-2 tracking-wide font-inter text-[14px]"
                  >
                    Create your takeoff
                  </button> */}
                  <CustomButton
                    text="Create New Project"
                    className="!w-fit !py-3 !px-5 !text-[14px]"
                    icon={plussvg}
                    iconwidth={20}
                    iconheight={20}
                    onClick={handleOpen}
                  />
                </div>
              </div>
              <div className="h-[80%] relative w-[45%] flex justify-center flex-col items-center rounded-3xl my-3 bg-gradient-to-r from-lavenderPurpleReplica/5 to-[#6A56F6]/5">
                <span className="absolute right-5 top-3 border-[2px] border-yellow-200 rounded-[30px] text-yellow-400 py-1 px-3 font-semibold cursor-pointer bg-yellow-400 bg-opacity-10">
                  Coming soon
                </span>
                <div className="h-[50%] flex items-end">
                  <div className="p-8 rounded-full mb-5 bg-gradient-to-r from-lavenderPurpleReplica/10 to-[#6A56F6]/10">
                    <img width={85} height={80} src={create_icon2} alt="" />
                  </div>
                </div>
                <div className="h-[50%] flex flex-col items-center gap-3 pt-12">
                  <div className="font-semibold font-inter text-[20px] leading-[34px] tracking-wide text-[#181818]">
                    Launch Takeoff AI
                  </div>
                  <div className="text-center font-inter font-light text-[14px] text-[#667085]  break-words w-[90%] leading-[22px] tracking-wider">
                    Automate quantity takeoffs with AI-powered precision. Click
                    here to generate fast, accurate measurements directly from
                    your construction plans
                  </div>
                  {/* <button
                    onClick={() => {
                      setshowAi(true);
                    }}
                    className="cursor-pointer mt-5 w-[60%] bg-transparent rounded-md p-2 tracking-wide font-inter text-[14px] border border-lavenderPurpleReplica text-lavenderPurpleReplica hover:text-white hover:!border-none hover:bg-gradient-to-r from-lavenderPurpleReplica to-[#6A56F6]"
                  >
                    Create AI takeoff
                  </button> */}
                  <CustomButton
                    text="Start AI Schedule"
                    className="!w-fit !py-3 !px-5 !text-[14px] text-lavenderPurpleReplica bg-[#E6F2F8] !border-none"
                    icon={<PlusOutlined />}
                    iconwidth={20}
                    iconheight={20}
                    // onClick={handleOpen}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <div className="mainpage !p-0">
          <div className="row !p-0 !h-full">
            <div className="col-md-12 !p-0 !h-full">
              <div className="final__bg__09 !h-full">
                <div className="seaech__box___00">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="s_09ssd">
                        <h3>
                          <span className="s__999099">
                            <HomeIcon />
                          </span>
                          {selectedObs?.organization}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="click___createprojects">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="product____create">
                          <div className="icon__create_00">
                            <img src={create_icon} alt="iconleft" />
                          </div>
                          <div className="create__content">
                            <h3>Create Project Schedule</h3>
                            <p>
                              Lorem ipsum is a placeholder text commonly used to
                              demonstrate the visual form of a document or a
                              typeface without relying on meaningful content.
                            </p>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleOpen}
                            >
                              <span className="s__11444">
                                <AddIcon />
                              </span>{" "}
                              Create New Projects
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6  comming">
                        <div
                          className="product____create"
                          style={{ position: "relative" }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "20px",
                            }}
                          >
                            <div
                              style={{
                                background: "#FFC107",
                                color: "white",
                                borderRadius: "28px",
                                padding: "10px 16px 10px 16px",
                              }}
                            >
                              Coming soon
                            </div>
                          </div>
                          <div className="icon__create_00">
                            <img src={create_icon2} alt="iconleft" />
                          </div>
                          <div className="create__content">
                            <h3>Create Schedule by AI</h3>
                            <p>
                              Lorem ipsum is a placeholder text commonly used to
                              demonstrate the visual form of a document or a
                              typeface without relying on meaningful content.
                            </p>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleOpen}
                              style={{ color: "#007AB6", background: "#E6F2F8" }}
                            >
                              <span className="s__11444">
                                <AddIcon />
                              </span>{" "}
                              Start New Takeoff
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Modal for creating a new project */}
        <Modal className="s___showing__-0987" open={open} onClose={handleClose}>
          <Slide direction="left" in={open} mountOnEnter unmountOnExit>
            <Box
              sx={{
                ...style,
                right: "0",
                transform: "translate(-0%, -50%)",
                width: 500,
                borderRadius: "8px",
                padding: "0px",
              }}
              className="!overflow-y-auto"
            >
              <div
                className={`w-full h-full px-7 !py-4 flex flex-col relative`}
              >
                <div
                  onClick={handleClose}
                  className="fixed bg-white rounded-[7px] top-[2px] right-[510px] cursor-pointer !w-[29px] !h-[29px] flex items-center justify-center"
                >
                  <CloseOutlined width={11} height={13} className="" />
                </div>
                <div className="text-lavenderPurpleReplica text-[28px] font-[600]">
                  Add New Project
                </div>
                <div className="py-4 flex flex-wrap justify-between gap-y-5">
                  <div className="w-full">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Select OBS
                    </label>
                    <AntSelect
                      size="large"
                      className="w-full"
                      placeholder="Select OBS"
                      showSearch
                      value={selectedObs?._id}
                      options={obsData?.map((item) => ({
                        value: item?._id,
                        label: item.organization,
                      }))}
                      onChange={(val) => {
                        const selectedObsId = val;
                        const selectedObs = obsData.find(
                          (item) => item._id === selectedObsId
                        );
                        dispatch(setSelectedOBS(selectedObs));
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </div>

                  <div className="w-[45%]">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Project ID
                    </label>
                    <Input
                      value={newProject.projectId}
                      className="!w-full !p-[7px]"
                      size="large"
                      name="projectId"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-[45%]">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Project Status
                    </label>
                    <AntSelect
                      size="large"
                      className="w-full"
                      placeholder="Select Status"
                      value={newProject.projectStatus}
                      onChange={(value) =>
                        setNewProject((prev) => ({
                          ...prev,
                          projectStatus: value,
                        }))
                      }
                      options={statuses}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Project Name
                    </label>
                    <Input
                      value={newProject.projectName}
                      placeholder="Enter Project name"
                      className="!w-full !p-[7px]"
                      size="large"
                      name="projectName"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Owner Representative
                    </label>
                    <AntSelect
                      size="large"
                      className="w-full"
                      placeholder="Owner Representative"
                      showSearch
                      value={newProject.owner}
                      options={users
                        ?.filter((item) => item?.firstName)
                        .map((user) => ({
                          value: user?._id,
                          label: `${user?.firstName} ${user?.lastName} - ${
                            Array.isArray(user?.roles) && user.roles.length > 0
                              ? user.roles[0].name
                              : user.userRole
                          }`,
                        }))}
                      onChange={(val) => {
                        setNewProject((prev) => ({ ...prev, owner: val }));
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Duration
                    </label>
                    <Input
                      value={newProject.duration}
                      placeholder="Enter Duration"
                      type="number"
                      className="!w-full !p-[7px]"
                      size="large"
                      name="duration"
                      onChange={handleChange}
                      suffix={
                        <span className="text-white font-[500] h-full px-3 bg-lavenderPurpleReplica rounded-3xl">
                          Days
                        </span>
                      }
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Due Date
                    </label>
                    {/* <Input value={newProject.projectStatus} placeholder="# e.g. 70(%)" name="projectStatus" type="number" className="!w-full !p-[7px]" size="large" onChange={handleChange} /> */}
                    <DatePicker
                      placeholder="Due Date"
                      className="w-full"
                      size="large"
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                      onChange={(date, dateString) => {
                        setNewProject({
                          ...newProject,
                          enddate: dateString,
                          dueDate: dateString,
                        });
                      }}
                    />
                  </div>

                  <div className="w-[45%]">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      Start Date
                    </label>
                    {/* <Input value={newProject.projectId} className="!w-full !p-[7px]" size="large" name="projectId" onChange={handleChange} /> */}
                    <DatePicker
                      placeholder="Start Date"
                      size="large"
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                                             onChange={(date, dateString) => {
                         // alert(JSON.stringify({date,dateString}))
                         // return
                         if (newProject?.enddate) {
                           const startDate = new Date(dateString);
                           const endDate = new Date(newProject?.enddate);
                           const excludedDays = newProject.dayExcudeArray?.map(item => 
                             getDayIndexFromName(item.dayName)
                           ) || [];
                           const workingDays = calculateWorkingDays(startDate, endDate, excludedDays);

                           setNewProject({
                             ...newProject,
                             startdate: dateString,
                             startIn: toInt(startDate),
                             duration: workingDays,
                           });
                         } else {
                           setNewProject({
                             ...newProject,
                             startdate: dateString,
                             startIn: toInt(new Date(dateString)),
                           });
                         }
                       }}
                    />
                  </div>

                  <div className="w-[45%]">
                    <label
                      htmlFor=""
                      className="text-[#344054] text-[14px] font-[500] mb-1"
                    >
                      End Date
                    </label>
                    {/* <Input value={newProject.projectStatus} placeholder="# e.g. 70(%)" name="projectStatus" type="number" className="!w-full !p-[7px]" size="large" onChange={handleChange} /> */}
                    <DatePicker
                      placeholder="End Date"
                      size="large"
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                                             onChange={(date, dateString) => {
                         const startDate = new Date(newProject?.startdate);
                         const endDate = new Date(dateString);
                         const excludedDays = newProject.dayExcudeArray?.map(item => 
                           getDayIndexFromName(item.dayName)
                         ) || [];
                         const workingDays = calculateWorkingDays(startDate, endDate, excludedDays);

                         setNewProject({
                           ...newProject,
                           enddate: dateString,
                           dueDate: dateString,
                           endIn: endDate.getTime(),
                           duration: workingDays,
                         });
                       }}
                    />
                  </div>

                  <div className="bg-white rounded-lg shadow border border-gray-200 p-4 w-full max-w-xl">
                    <h3 className="bg-[#EAECF0] text-[#101828] text-[16px] font-semibold px-4 py-2 rounded-t-lg">
                      Assign Manager/OBC
                    </h3>

                    {/* Dropdown and Add Button */}
                    <div className="flex items-center gap-2 mt-4">
                      <AntSelect
                        showSearch
                        className="flex-1"
                        placeholder="Enter Name"
                        value={selectedUserTemp}
                        onChange={(value) => setSelectedUserTemp(value)}
                        options={users
                          ?.filter((item) => item?.firstName)
                          ?.map((user) => ({
                            value: user._id,
                            label: `${user?.firstName} ${user?.lastName}`,
                          }))}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      />
                      <Button
                        variant="contained"
                        className="!bg-blue-600 !text-white !capitalize"
                        onClick={() => {
                          const selected = users.find(
                            (u) => u._id === selectedUserTemp
                          );
                          if (
                            selected &&
                            !selectedUsers.some(
                              (u) => u._id === selectedUserTemp
                            )
                          ) {
                            const updatedUsers = [...selectedUsers, selected];
                            setSelectedUsers(updatedUsers);
                            setNewProject((prev) => ({
                              ...prev,
                              assignManager: updatedUsers,
                              toShowManager: updatedUsers,
                            }));
                          }
                          setSelectedUserTemp(null);
                        }}
                      >
                        + Add
                      </Button>
                    </div>

                    {/* Manager List */}
                    <div className="mt-4 space-y-3">
                      {selectedUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-2 rounded-md relative"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar ?? user.companyLogo ?? userimg}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-[#101828] font-medium">
                                {user.firstName + " " + user.lastName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 relative">
                            <AntSelect
                              size="small"
                              className="w-full !text-red-600"
                              variant="borderless"
                              value={user.role || "Project Manager"}
                              onChange={(value) =>
                                handleRoleChange(user._id, value)
                              }
                              options={userRoles}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                            />

                            <div
                              className="cursor-pointer"
                              onClick={() =>
                                setActionMenuOpenUserId(
                                  actionMenuOpenUserId === user._id
                                    ? null
                                    : user._id
                                )
                              }
                            >
                              <MoreVertIcon />
                            </div>

                            {actionMenuOpenUserId === user._id && (
                              <div className="absolute right-0 top-5 bg-white border border-black rounded shadow-md z-10 w-[100px]">
                                <div
                                  onClick={() => {
                                    setSelectedUsers((prev) =>
                                      prev.filter((u) => u._id !== user._id)
                                    );
                                    setActionMenuOpenUserId(null);
                                  }}
                                  className="px-3 py-2 hover:bg-red-50 text-red-600 text-sm cursor-pointer"
                                >
                                  Delete
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <CustomButton
                      text="Next"
                      className="!w-[50%] !py-3 !px-5 !text-[14px]"
                      // icon={plussvg}
                      // iconwidth={20}
                      // iconheight={20}
                      onClick={handleCreate}
                    />
                  </div>
                </div>
              </div>
              {/* <Typography variant="h6" component="h2">
                <h1 className="s__09iii  newprojecttext ">Add New Project</h1>
              </Typography>

              <div className="s__set__09w   ">
                <div className="row">
                  <div className="col-md-12">
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="obs-label">Select OBS</InputLabel>
                      <Select
                        label="Select OBS"
                        labelId="obs-label"
                        name="obsSelect"
                        value={selectedObs._id}
                        onChange={(e) => {
                          const selectedObsId = e.target.value;
                          const selectedObs = obsData.find((item) => item._id === selectedObsId);
                          dispatch(setSelectedOBS(selectedObs));
                        }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select OBS</MenuItem>
                        {obsData.map((item) => (
                          <MenuItem value={item._id} key={item._id}>
                            {item.organization}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                  </div>

                  <div className="col-md-6">
                    <TextField
                      label="Project ID"
                      name="projectId"
                      value={newProject.projectId}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </div>

                  <div className="col-md-6">
                    <TextField
                      label="Project Status %"
                      name="projectStatus"
                      value={newProject.projectStatus}
                      onChange={handleChange}
                      fullWidth
                      type="number"
                      margin="normal"
                    />
                  </div>

                  <div className="col-md-12">
                    <TextField
                      label="Project Name"
                      name="projectName"
                      value={newProject.projectName}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </div>

                  <div className="col-md-12">
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="assign-manager-label">
                        Owner Representative
                      </InputLabel>
                      <Select
                        label="Owner Representative"
                        placeholder="Owner Representative"
                        labelId="assign-manager-label"
                        name="owner"
                        value={newProject.owner}
                        onChange={handleChange}
                        displayEmpty
                        disabled={loadings}
                      >
                        {users?.length > 0 ? (
                          users?.map((user) => (
                            <MenuItem key={user._id} value={user?.firstName}>
                              {user.firstName +
                                " " +
                                user.lastName +
                                " - " +
                                ((Array.isArray(user?.roles) && user?.roles?.length > 0) ? user?.roles[0]?.name : user.userRole)}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            {loadings ? "Loading..." : "No users found"}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <TextField
                      label="Start Date"
                      type="date"
                      name="startdate"
                      value={newProject?.startDate || ""}
                      onChange={(e) => {
                        if (newProject?.enddate) {
                          const startDate = new Date(e.target.value);
                          const endDate = new Date(newProject?.enddate);
                          const workingDays = calculateWorkingDays(startDate, endDate);

                          setNewProject({
                            ...newProject,
                            startdate: e.target.value,
                            startIn: toInt(startDate),
                            duration: workingDays,
                          });
                        } else {
                          setNewProject({
                            ...newProject,
                            startdate: e.target.value,
                            startIn: toInt(new Date(e.target.value)),
                          });
                        }
                      }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <TextField
                      label="End Date"
                      type="date"
                      name="enddate"
                      value={newProject.enddate || ""}
                      onChange={(e) => {
                        console.log(
                          new Date().getTime(),
                          "eeeeeeeeee",
                          e.target.value
                        );
                        const startDate = new Date(newProject?.startdate);
                        const endDate = new Date(e.target.value);
                        const workingDays = calculateWorkingDays(startDate, endDate);

                        setNewProject({
                          ...newProject,
                          enddate: e.target.value,
                          dueDate: e.target.value,
                          endIn: endDate.getTime(),
                          duration: workingDays,
                        });
                      }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className="col-md-12">
                    <TextField
                      label="Duration"
                      name="duration"
                      value={newProject.duration}
                      onChange={(e) => {
                        const days = parseInt(e.target.value, 10);
                        const newStartDate = new Date();
                        const newEndDate = addDays(newStartDate, days);

                        setNewProject((prevState) => ({
                          ...prevState,
                          ["duration"]: e.target.value,
                          startdate: formatDate(newStartDate),
                          enddate: formatDate(newEndDate),
                          dueDate: formatDate(newEndDate),
                          endIn: new Date(newEndDate).getTime(),
                          startIn: toInt(new Date(newStartDate)),
                        }));
                      }}
                      fullWidth
                      margin="normal"
                    />
                  </div>

                  <div className="col-md-12">
                    <TextField
                      label="Due Date"
                      type="date"
                      name="dueDate"
                      value={newProject.dueDate || ""}
                      onChange={(e) => {
                        setNewProject({
                          ...newProject,
                          enddate: e.target.value,
                          dueDate: e.target.value,
                        });
                      }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>

                  <div className="s__oihghjks">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-12">
                            <h3 className="setfontss">Assign Manager</h3>
                          </div>

                          <div className="col-md-12">
                            <div className="assign_manager_obs">
                              <FormControl fullWidth margin="normal">
                                <InputLabel id="assign-manager-label">
                                  Assign Manager
                                </InputLabel>
                                <Select
                                  label="Enter Name"
                                  labelId="assign-manager-label"
                                  name="assignManager"
                                  value={newProject.assignManager}
                                  onChange={handleSelectUser}
                                  displayEmpty
                                  disabled={loadings}
                                >
                                  {users?.length > 0 ? (
                                    users?.map((user) => (
                                      <MenuItem key={user._id} value={user._id}>
                                        {user.firstName + " " + user?.lastName}
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <MenuItem value="" disabled>
                                      {loadings ? "Loading..." : "No users found"}
                                    </MenuItem>
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="assignmanneger">
                        <div className="manager__listing">
                          <ul className="d-flex flex-column gap-2 justify-content-center ">
                            {selectedUsers.map((user) => (
                              <li key={user._id}>
                                <div className="user__img__00">
                                  <img
                                    src={user?.avatar ?? user?.companyLogo}
                                    alt="iconleft"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50px",
                                    }}
                                  />
                                </div>
                                <div className="user__name__009">
                                  <h3>{user.firstName + " " + user.lastName}</h3>
                                </div>
                                <div className="user__position">
                                  {user.roleType}
                                </div>
                                <div
                                  className="action__showing"
                                  style={{ cursor: "pointer" }}
                                >
                                  <MdDeleteOutline
                                    color="red"
                                    onClick={() => handleDelete(user._id)}
                                  />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="button__00999">
                      <Button
                        className="wclose"
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
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div> */}
            </Box>
          </Slide>
        </Modal>
        <Modal
          open={open1}
          onClose={() => {
            setOpen1(false);
          }}
        >
          <Box sx={{ ...style, width: 700 }}>
            <Typography variant="h6" component="h2">
              <h1 className="s__09iii">Create New User</h1>
            </Typography>

            <div className="s__set__09w">
              <h3 className="createnewobs">Enter User Name</h3>
              <TextField
                label="User Name"
                name="Organization"
                value={newUser?.name}
                onChange={(e) => {
                  setNewUser({ ...newUser, name: e.target.value });
                }}
                fullWidth
                margin="normal"
              />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => {
                    setNewUser({ ...newUser, profileImage: e.target.files[0] });
                  }}
                />
              </Button>

              <div className="button__00999">
                <Button
                  className="wclose"
                  onClick={() => {
                    setOpen1(false);
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Close
                </Button>
                <Button
                  onClick={handleCreateNewUser}
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
  right: "0",
  transform: "translate(-0%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
