"use client"

import React, { useEffect, useState } from "react"
import Leftsidebar from "./Leftsidebar"
import { useTable } from "react-table"
import Icon from "../images/Icon.png"
import plussvg from "../images/plus.svg"
import { toast } from "react-toastify"
import { Modal, Box, Button, MenuItem, Menu, Fade } from "@mui/material"
import { IoIosArrowDown } from "react-icons/io"
import { FaFileDownload, FaPencilAlt } from "react-icons/fa"
import axios from "axios"
import Swal from "sweetalert2"
import formatDate from "../formatDate"
import { Link, useNavigate } from "react-router-dom"
import { setProjectData, setSelectedOBS } from "./redux/projectSlice"
import { useDispatch } from "react-redux"
import UpdateProject from "./UpdateProject"
import { backend_url, backend_url_core } from "../constants/api"
import { InputComponent } from "./InputComponent"
import Navbar from "./Navbar";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EyeFilled,
  HomeFilled,
  ImportOutlined,
  MailFilled,
  PrinterFilled,
  SearchOutlined,
} from "@ant-design/icons"
import CustomButton from "./CustomButton"
import { Card, Input, Table, Select as AntSelect } from "antd"
import CustomEmailTemplate from "./customEmailTemplete"
import { Modal as AndModal } from "antd"
import statuses from "../constants/statuses"

const { TextArea } = Input

function FadeMenu({ handleOpen1, setProject, projectData, setshowEmailModal }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleEditClick = () => {
    setProject(projectData) // Set the specific project data
    handleOpen1() // Open the modal
    handleClose() // Close the menu
  }
  const openProjectWBS = async () => {
    if (!projectData?._id) return
    try {
      const response = await axios.get(backend_url + "/getSingleProjectById/" + projectData?._id)
      console.log(projectData, response, " ===> response while getting single project for wbs")
      dispatch(
        setProjectData({
          ...response.data,
          toShowManager:
            Array.isArray(response.data?.assignManager) && response.data?.assignManager?.length > 0
              ? response.data?.assignManager
              : [],
        }),
      )
      navigate("/Ganttchatv2")
    } catch (error) {
      console.log(error, " ===> Error while fetching single project")
    }
  }
  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img src={Icon || "/placeholder.svg"} />
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEditClick} className="!m-1 !border-none rounded hover:!bg-gray-200">
          <div className="d-flex gap-2" style={{ color: "black" }}>
            <FaPencilAlt size={16} />
            <div>
              Edit <span className="!opacity-0">Edit all details here</span>
            </div>
          </div>
        </MenuItem>
        <MenuItem className="!m-1 !border-none rounded hover:!bg-gray-200" onClick={openProjectWBS}>
          <div className="d-flex gap-2" style={{ color: "black" }}>
            <EyeFilled size={16} />
            <div>View</div>
          </div>
        </MenuItem>
        <MenuItem
          className="!m-1 !border-none rounded hover:!bg-gray-200"
          onClick={() => {
            setshowEmailModal(true)
          }}
        >
          <div className="d-flex gap-2 items-center text-black">
            <MailFilled size={16} />
            <div>Email</div>
          </div>
        </MenuItem>
        <MenuItem className="!m-1 !border-none rounded hover:!bg-gray-200" onClick={() => setshowEmailModal(true)}>
          <div className="d-flex gap-2 items-center text-black">
            <ImportOutlined size={18} />
            <div>Import Time Schedule</div>
          </div>
        </MenuItem>
        <MenuItem className="!m-1 !border-none rounded hover:!bg-gray-200" onClick={() => setshowEmailModal(true)}>
          <div className="d-flex gap-2 items-center text-black">
            <FaFileDownload size={16} />
            <div>Export Time Schedule</div>
          </div>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default function Createobs() {
  console.log(backend_url, " ===> backend url here")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open1, setOpen1] = useState(false)
  const [userDetails, setUserDetails] = useState(null); // Add this line
  const [project, setProject] = useState()
  const [tasks, setTasks] = useState({});
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState(false)
  const [obsData, setObsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [obsData1, setObsData1] = useState([])
  const [selectedObs, setSelectedObs] = useState(null)

  const handleOpen1 = () => setOpen1(true)
  const handleClose1 = () => setOpen1(false)

 const fetchObsData = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)
  try {
    const response = await axios.get(backend_url + `/allProject/${user?._id}`);
    setObsData(response.data);
    setLoading(false);
    // Fetch tasks for all projects
    if (response.data.length > 0 && user?._id) {
      response.data.forEach((project) => {
        fetchTasksForProject(user?._id, project._id);
      });
    }
  } catch (err) {
    setError(err);
    setLoading(false);
  }
};

  const fetchTasksForProject = async (userId, projectId) => {
  try {
    const response = await axios.get(`${backend_url}/chartsA/${userId}/${projectId}`);
    console.log("Tasks fetched for project", projectId, ":", response.data?.tasks);
    setTasks((prevTasks) => ({
      ...prevTasks,
      [projectId]: response.data?.tasks || [],
    }));
  } catch (error) {
    console.error("Error fetching tasks for project", projectId, ":", error);
    setTasks((prevTasks) => ({
      ...prevTasks,
      [projectId]: [],
    }));
  }
};

  const handleChangeHandle = (e) => {
    const { name, value } = e.target
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }))
  }

  const handleUpdate = async () => {
    try {
      await fetchObsData()
      console.log("Updated project:", project)
      handleClose1()
    } catch (error) {
      console.error("Error updating project:", error)
    }
  }

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    setUserId(user._id);
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get(`${backend_url_core}/api/user/userdetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(response.data); // Store the API response
      } catch (err) {
        console.error("Error fetching user details:", err);
        Swal.fire("Error", "Failed to fetch user details", "error");
      }
    };
    fetchUserDetails();
  }
}, []);

  useEffect(() => {
    fetchObsData()
  }, [])

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
  })
  const [obs, setObs] = useState({
    Organization: "",
    description: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(2)

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredObsData = React.useMemo(
    () =>
      obsData
        .map((project) => ({
          ...project,
          dueDate: formatDate(project.dueDate),
        }))
        .filter((project) => project.projectName.toLowerCase().includes(searchQuery.toLowerCase())),
    [obsData, searchQuery],
  )

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  

  

  const handleChange = (e) => {
    const { name, value } = e.target
    setObs((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setUserId(user._id)
    }
  }, [])

  useEffect(() => {
    const fetchObsData = async () => {
      const user = JSON.parse(localStorage.getItem("user"))
      try {
        const response = await axios.get(backend_url + "/allObs" + `/${user?._id}`)
        setObsData1(response.data)
        // Set the first OBS as the default selected value
        if (response.data.length > 0) {
          setSelectedObs(response.data[0])
          dispatch(setSelectedOBS(response.data[0]))
        }
      } catch (err) {
        Swal.fire("Error", "Failed to fetch OBS data", "error")
      }
    }
    fetchObsData()
  }, [])


  const handleCreate = async () => {
    try {
      if(obs.Organization && obs.Organization!="")
      {
      const response = await axios.post(backend_url + "/createObs", {
        userId,
        description: obs.description,
        organization: obs.Organization,
      })

      if (response.data.success) {
        console.log(response.data.message)
        dispatch(setSelectedOBS(response.data.newobs))
        handleClose()
        navigate("/universalconstruction")
      }
    }
    else{
      navigate("/universalconstruction")
    }
    } catch (error) {
      console.error("Error creating OBS:", error.response ? error.response.data.message : error.message)
    }
  }

  const columns1 = [
    {
      title: "Project #",
      dataIndex: "projectId",
      align: "center",
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      align: "center",
    },
    {
      title: "Managing Company (OSB)",
      dataIndex: "userId",
      align: "center",
      render: (userId) => userId?.organizationName || "-",
    },
    {
      title: "Owner Representative (OSB)",
      dataIndex: "owner",
      align: "center",
      render: (owner) => owner|| "-",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      align: "center",
    },
    {
  title: "Task",
  dataIndex: "workingHours",
  align: "center",
  render: (_, record) => `${tasks[record._id]?.length || 0}/56`,
},
  {
      title: "Status",
      dataIndex: "projectStatus",
      align: "center",
      render: (projectStatus) => (
        <div
          style={{
            whiteSpace: "nowrap",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "4px",
            borderRadius: "25%",
            backgroundColor: "#ECFDF3",
            color: "#027A48",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {statuses.find((status) => status.value === projectStatus)?.label || "Active"}
        </div>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (text, record) => (
        <FadeMenu
          handleOpen1={handleOpen1}
          setProject={setProject}
          projectData={record}
          setshowEmailModal={setshowEmailModal}
        />
      ),
    },
  ]

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
        Header: "Owner Representative",
        accessor: "owner",
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
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => <FadeMenu handleOpen1={handleOpen1} setProject={setProject} projectData={row.original} />,
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: filteredObsData,
  })
  const [showEmailModal, setshowEmailModal] = useState(false)
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)

  const HOVERED_MARGIN_LEFT = "ml-[240px]"
  const UNHOVERED_MARGIN_LEFT = "ml-[80px]"
  const [isOpened, setisOpened] = useState(true)

  const toggleCollapsed = () => {
    setisOpened(!isOpened)
  }

  const components = {
    header: {
      cell: (props) => (
        <th
          {...props}
          style={{
            backgroundColor: "#F2F4F7",
            color: "#475467",
            fontSize: "14px",
            fontFamily: "inter",
            fontWeight: 500,
            padding: "12px 16px",
            textAlign: "left",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          {props.children}
        </th>
      ),
    },
  }

  return (
    <>
      <Leftsidebar isOpened={isOpened} toggleCollapsed={toggleCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpened ? HOVERED_MARGIN_LEFT : UNHOVERED_MARGIN_LEFT
        }`}
      >
        
        <Navbar user={userDetails || {}} />
        <div className="mainpage !px-10 !py-7" style={{ height: "calc(100vh - 80px)", overflow: "hidden" }}>
          <div className="row !p-0 !h-full">
            <div className="col-md-12 !p-0 !h-full">
              <div
                className="final__bg__09 !px-10 !py-8"
                style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", overflow: "hidden" }}
              >
                <div className="seaech__box___00" style={{ flexShrink: 0 }}>
                  <div className="flex justify-between items-center mb-6">
                    <div className="col-md-2 d-flex justify-content-start justiClass align-items-center">
                      <div className="s_09ssd justiClass">
                        <div className="!text-[#333E4F] !text-[20px] !font-[600] !m-0 !p-0">Schedule</div>
                      </div>
                    </div>
                    <div className="inline-flex items-end space-x-3">
                      <InputComponent
                        label=""
                        name=""
                        inputStyle={"!w-64"}
                        type="text"
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        field={{
                          value: searchQuery ? searchQuery : undefined,
                          onChange: (e) => {
                            setSearchQuery(e.target.value)
                          },
                          allowClear: true,
                        }}
                      />
                      <CustomButton
                        text="Create OBS"
                        className="!w-fit !py-3 !px-5 !text-[14px] !min-w-[120px] !whitespace-nowrap cursor-pointer bg-[#007AB6]"
                        icon={plussvg}
                        iconwidth={20}
                        iconheight={20}
                        onClick={handleOpen}
                      />
                      <Link to="/universalconstruction">
                        <CustomButton
                          text="Create New Project"
                          className="!w-fit !py-3 !px-5 !text-[14px] !min-w-[140px] !whitespace-nowrap bg-[#007AB6]"
                          icon={plussvg}
                          iconwidth={20}
                          iconheight={20}
                          onClick={handleOpen}
                        />
                      </Link>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
                  <Table
                    className="rounded-lg border"
                    columns={columns1}
                    dataSource={filteredObsData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                    pagination={false}
                    components={components}
                    style={{ flex: 1, width: "100%" }}
                  />

                  <div className="flex justify-center items-center mt-4 mb-4">
      <div className="flex items-center space-x-2">
        <button
          className="border border-gray-300 rounded p-2.5 mx-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          <ArrowLeftOutlined style={{ fontWeight: "bolder" }} />
        </button>
        {Array.from({ length: Math.ceil(filteredObsData.length / pageSize) }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`rounded px-2 py-1.5 mx-1 min-w-[28px] ${
              currentPage === page
                ? "text-blue-500 border-1 border-blue-600 bg-white"
                : "text-gray-700 border border-gray-300 bg-white hover:bg-gray-50"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="border border-gray-300 rounded p-2.5 mx-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage >= Math.ceil(filteredObsData.length / pageSize)}
          onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(filteredObsData.length / pageSize), prev + 1))}
        >
          <ArrowRightOutlined style={{ fontWeight: "bolder" }} />
        </button>
      </div>
    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AndModal
          open={showEmailModal}
          setOpen={setshowEmailModal}
          closable={false}
          footer={null}
          centered={true}
          destroyOnClose={false}
          onCancel={(e) => {
            e.stopPropagation()
          }}
          width={"25%"}
          className="!bg-transparent custom-email-modal"
          style={{ zIndex: 10000 }}
        >
          <CustomEmailTemplate
            isFileUploadShow={true}
            setEmailModal={setshowEmailModal}
            submitHandler={async (formData) => {
              console.log(formData, " ===> Form Data here")
              setIsSubmittingEmail(true)
              try {
                const token = localStorage.getItem("token")
                const response = await axios.post(
                  backend_url_core + "/api/email" + `/send`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                console.log(response, " ===> Response here")
                if (response.statusCode === 200 || response.status === 200) {
                  toast.success("Email sent successfully")
                  setshowEmailModal(false)
                }
              } catch (error) {
                const err = error
                toast.error(err.response?.data.message)
              } finally {
                setIsSubmittingEmail(false)
              }
            }}
            to={""}
            isSubmitting={isSubmittingEmail}
          />
        </AndModal>

        <Modal
          centered
          open={open}
          footer={null}
          onCancel={handleClose}
          closable={false}
          className="!p-0 [&_.ant-modal-body]:!p-2.5"
        >
          <Box sx={{ ...style }} className="obsmodal">
            <div className="px-3">
              <h1 className="text-[19px] font-semibold text-[#1D2939] mb-2.5 text-center">
                Create OBS Structure
              </h1>
              <Card className="rounded-lg !border-[#007AB6] p-2.5 !border">
                <div className="bg-[#0071BC] text-white px-2.5 py-2 rounded-lg flex justify-between items-center">
                  <span className="text-[12.5px] font-medium">Current OBS Projects</span>
                  <IoIosArrowDown size={19} className="rotate-180" />
                </div>
                <div className="p-2.5 border-t border-[#E4E7EC] bg-[#F9FAFB]">
                  <AntSelect
                    size="large"
                    className="w-full"
                    placeholder="Select OBS"
                    showSearch
                    value={selectedObs?._id}
                    options={obsData1?.map((item) => ({
                      value: item._id,
                      label: item.organization,
                    }))}
                    onChange={(val) => {
                      const selectedObsObj = obsData1.find((item) => item._id === val)
                      console.log("Selected OBS:", selectedObsObj)
                      setSelectedObs(selectedObsObj)
                      dispatch(setSelectedOBS(selectedObsObj))
                    }}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </div>
                <div className="px-3 pt-2.5 pb-3">
                  <h3 className="text-[16px] font-semibold text-[#101828] mb-2.5">
                    Create New OBS
                  </h3>
                  <div className="flex flex-col gap-1 mb-2.5">
                    <label className="text-[12px] text-[#464646]">Organization Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="Organization"
                      value={obs.Organization}
                      onChange={handleChange}
                      className="!p-1.5 !rounded-md text-[13.5px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] text-[#464646]">Description</label>
                    <TextArea
                      placeholder=""
                      name="description"
                      value={obs.description}
                      onChange={handleChange}
                      className="!p-1.5 !rounded-md text-[13.5px]"
                      autoSize={{ minRows: 2, maxRows: 3 }}
                    />
                  </div>
                </div>
              </Card>
              <div className="flex justify-center gap-3 mt-3">
                <Button
                  onClick={handleClose}
                  className="!border !border-[#F2F4F7] text-[#6941C6] text-[13.5px] py-1.5 w-[125px] rounded-md shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCreate(obs)}
                  className="!bg-[#007AB6] text-white text-[13.5px] !py-1.5 w-[155px] rounded-md shadow-sm"
                >
                  Save
                </Button>
              </div>
            </div>
          </Box>
        </Modal>

        <UpdateProject
          open={open1}
          handleClose={handleClose1}
          project={project}
          handleUpdate={handleUpdate}
          handleChange={handleChangeHandle}
          refetchData={fetchObsData}
        />
      </div>
    </>
  )
}

const style = {
  position: "absolute",
  width: "600px",
  maxWidth: "90vw",
  maxHeight: "100vh",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "8px",
  overflow: "auto",
}