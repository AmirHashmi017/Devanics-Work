import React, { useEffect, useState } from "react";
import { Modal, Box, Button, Typography, Slide } from "@mui/material";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Select as AntSelect, DatePicker, Input } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { setProjectData } from "./redux/projectSlice";
import CustomButton from "./CustomButton";
import { backend_url, backend_url_core } from "../constants/api";
import userimg from "../images/Avatar.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import statuses from "../constants/statuses";
import { Navigate } from "react-router-dom";

const UpdateProject = ({ open, handleClose, project, handleUpdate, handleChange,refetchData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [newProject, setNewProject] = useState({
    projectId: "",
    projectName: "",
    owner: "",
    duration: "",
    dueDate: "",
    projectStatus: "STATUS_WAITING",
    startdate: "",
    enddate: "",
    assignManager: [],
    toShowManager: [],
  });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserTemp, setSelectedUserTemp] = useState(null);
  const [actionMenuOpenUserId, setActionMenuOpenUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const userRoles = [
    { label: "Admin", value: "Admin" },
    { label: "Company", value: "Company" },
    { label: "Project Manager", value: "Project Manager" },
    { label: "Sales Manager", value: "Sales Manager" },
    { label: "Estimator", value: "Estimator" },
    { label: "Accounts Manager", value: "Accounts Manager" },
    { label: "Subcontractor", value: "Subcontractor" },
  ];

  // Fetch users
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${backend_url_core}/api/user/users?page=1&limit=9&queryRoles=`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data?.data?.employees || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Initialize project and selected users based on passed project data
  useEffect(() => {
    console.log(project)
    if (project) {
      const extractDate = (dateValue) => {
      if (!dateValue) return "";
      // If it's already a simple date string (like dueDate), return as is
      if (typeof dateValue === 'string' && !dateValue.includes('T')) {
        return dateValue;
      }
      // If it's a timestamp, extract just the date part
      return moment(dateValue).format('YYYY-MM-DD');
    };
      setNewProject({
        projectId: project.projectId || "",
        projectName: project.projectName || "",
        owner: project.owner || "",
        duration: project.duration || "",
        dueDate: project.dueDate || "",
        projectStatus: project.projectStatus || "STATUS_WAITING",
        startdate: extractDate(project.startdate || project.startDate) || "",
        enddate: extractDate(project.enddate || project.endDate) || "",
        assignManager: project.assignManager?.map((dr) => dr?._id) || [],
        toShowManager: project.assignManager || [],
      });
      setSelectedUsers(project.assignManager || []);
    }
  }, [project]);

  const handleSelectUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user && !selectedUsers.some((selectedUser) => selectedUser._id === userId)) {
      const updatedUsers = [...selectedUsers, user];
      setSelectedUsers(updatedUsers);
      setNewProject({
        ...newProject,
        assignManager: updatedUsers.map((u) => u._id),
        toShowManager: updatedUsers,
      });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${backend_url}/update-role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSelectedUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
      );
      Swal.fire("Role updated successfully!", "", "success");
    } catch (error) {
      Swal.fire("Error updating user role", "", "error");
      console.error("Error updating user role:", error);
    }
  };

  const handleDelete = (userId) => {
    const updatedUsers = selectedUsers.filter((user) => user._id !== userId);
    setSelectedUsers(updatedUsers);
    setNewProject({
      ...newProject,
      assignManager: updatedUsers.map((u) => u._id),
      toShowManager: updatedUsers,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${backend_url}/updateProject/${project._id}`,
        newProject,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const updatedProject = {
      ...response.data,
      toShowManager: response.data.assignManager.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0].name : user.userRole || "Project Manager",
      })),
    };
    dispatch(setProjectData(updatedProject));
      
      if(refetchData) {
        // Fetch the updated project to ensure the latest data is in Redux before navigation
    const fetchUpdatedProject = await axios.get(`${backend_url}/getSingleProjectById/${project._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    dispatch(setProjectData({
      ...fetchUpdatedProject.data,
      toShowManager: Array.isArray(fetchUpdatedProject.data?.assignManager) && fetchUpdatedProject.data?.assignManager?.length > 0
        ? fetchUpdatedProject.data?.assignManager
        : [],
    }));
      navigate("/calender")
      
    }
    else
    {
      Swal.fire("Project updated successfully!", "", "success");
    }
      handleClose();
    } catch (error) {
      Swal.fire("Error updating project", "", "error");
      console.error("Error updating project:", error);
    }
  };

  const getDayIndexFromName = (dayName) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days.indexOf(dayName);
  };

  const calculateWorkingDays = (startDate, endDate, excludedDays = []) => {
    let totalWorkingDays = 0;
    const tempDate = new Date(startDate);
    const holidays = []; // Add holidays as needed

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
    return totalWorkingDays;
  };

  const toInt = (date) => {
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            top: "0%",
            right: "0",
            transform: "translate(-0%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "8px",
            p: 0,
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div className="w-full h-full px-7 !py-4 flex flex-col relative">
            <div
              onClick={handleClose}
              className="fixed bg-white rounded-[7px] top-[2px] right-[510px] cursor-pointer !w-[29px] !h-[29px] flex items-center justify-center"
            >
              <CloseOutlined width={11} height={13} />
            </div>
            <Typography className="text-lavenderPurpleReplica text-[28px] font-[600]">
              Update Project
            </Typography>
            <div className="py-4 flex flex-wrap justify-between gap-y-5">
              <div className="w-[45%]">
                <label className="text-[#344054] text-[14px] font-[500] mb-1">Project ID</label>
                <Input
                  value={newProject.projectId}
                  className="!w-full !p-[7px]"
                  size="large"
                  name="projectId"
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-[45%]">
                <label className="text-[#344054] text-[14px] font-[500] mb-1">Project Status</label>
                <AntSelect
                  size="large"
                  className="w-full"
                  placeholder="Select Status"
                  value={newProject.projectStatus}
                  onChange={(value) =>
                    setNewProject((prev) => ({ ...prev, projectStatus: value }))
                  }
                  options={statuses}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                />
              </div>
              <div className="w-full">
                <label className="text-[#344054] text-[14px] font-[500] mb-1">Project Name</label>
                <Input
                  value={newProject.projectName}
                  placeholder="Enter Project name"
                  className="!w-full !p-[7px]"
                  size="large"
                  name="projectName"
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full">
                <label className="text-[#344054] text-[14px] font-[500] mb-1">Owner Representative</label>
                <Input
                  value={newProject.owner}
                  placeholder="Enter Owner name"
                  className="!w-full !p-[7px]"
                  size="large"
                  name="owner"
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full">
                <label className="text-[#344054] text-[14px] font-[500] mb-1">Duration</label>
                <Input
                  value={newProject.duration}
                  placeholder="Enter Duration"
                  type="number"
                  className="!w-full !p-[7px]"
                  size="large"
                  name="duration"
                  onChange={handleInputChange}
                  suffix={
                    <span className="text-white font-[500] h-full px-3 bg-lavenderPurpleReplica rounded-3xl">
                      Days
                    </span>
                  }
                />
              </div>
              <div className="w-full">
                <label className="text-[#344054] text-[14px] font-[500] mb-1">Due Date</label>
                <DatePicker
                  placeholder="Due Date"
                  className="w-full"
                  size="large"
                  value={newProject.dueDate ? moment(newProject.dueDate) : null}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
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
                <label className="text-[#344054] text-[14px] font-[500] mb-1">Start Date</label>
                <DatePicker
  placeholder="Start Date"
  size="large"
  value={newProject.startdate ? moment(newProject.startdate) : null}
  getPopupContainer={(triggerNode) => triggerNode.parentNode}
  onChange={(date, dateString) => {
    if (newProject.enddate) {
      const startDate = new Date(dateString);
      const endDate = new Date(newProject.enddate);
      const excludedDays = newProject.dayExcudeArray?.map((item) =>
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
                <label className="text-[#344054] text-[14px] font-[500] mb-1">End Date</label>
                <DatePicker
  placeholder="End Date"
  size="large"
  value={newProject.enddate ? moment(newProject.enddate) : null}
  getPopupContainer={(triggerNode) => triggerNode.parentNode}
  onChange={(date, dateString) => {
    const startDate = new Date(newProject.startdate);
    const endDate = new Date(dateString);
    const excludedDays = newProject.dayExcudeArray?.map((item) =>
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
                <div className="flex items-center gap-2 mt-4">
                  <AntSelect
                    showSearch
                    className="flex-1"
                    placeholder="Enter Name"
                    value={selectedUserTemp}
                    onChange={(value) => setSelectedUserTemp(value)}
                    options={users
                      ?.filter((item) => item?.name)
                      ?.map((user) => ({
                        value: user._id,
                        label: `${user?.name} - ${
                        Array.isArray(user?.roles) && user.roles.length > 0
                          ? user.roles[0].name
                          : user.userRole
                      }`,
                      }))}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                  <Button
                    variant="contained"
                    className="!bg-blue-600 !text-white !capitalize"
                    onClick={() => {
                      handleSelectUser(selectedUserTemp);
                      setSelectedUserTemp(null);
                    }}
                  >
                    + Add
                  </Button>
                </div>
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
                            {user.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 relative">
                        <AntSelect
                          size="small"
                          className="w-full !text-red-600"
                          variant="borderless"
                          value={user.role || "Project Manager"}
                          onChange={(value) => handleRoleChange(user._id, value)}
                          options={userRoles}
                          getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        />
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            setActionMenuOpenUserId(
                              actionMenuOpenUserId === user._id ? null : user._id
                            )
                          }
                        >
                          <MoreVertIcon />
                        </div>
                        {actionMenuOpenUserId === user._id && (
                          <div className="absolute right-0 top-5 bg-white border border-black rounded shadow-md z-10 w-[100px]">
                            <div
                              onClick={() => {
                                handleDelete(user._id);
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
                  text="Update"
                  className="!w-[50%] !py-3 !px-5 !text-[14px]"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </Box>
      </Slide>
    </Modal>
  );
};

export default UpdateProject;