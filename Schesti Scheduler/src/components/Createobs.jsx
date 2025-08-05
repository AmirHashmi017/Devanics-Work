import React, { useEffect, useState } from "react";
import Header from "./Header";
import Leftsidebar from "./Leftsidebar";
import { useTable } from "react-table";
import Icon from "../images/Icon.png";
import plussvg from "../images/plus.svg";
import { toast } from "react-toastify";

import { Modal, Box, Button, MenuItem, Menu, Fade } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { FaFileDownload, FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import formatDate from "../formatDate";
import { Link, useNavigate } from "react-router-dom";
import { setProjectData, setSelectedOBS } from "./redux/projectSlice";
import { useDispatch } from "react-redux";
import UpdateProject from "./UpdateProject";
import { backend_url, backend_url_core } from "../constants/api";
import { InputComponent } from "./InputComponent";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EyeFilled,
  HomeFilled,
  ImportOutlined,
  MailFilled,
  PrinterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import CustomButton from "./CustomButton";
import { Card, Input, Table } from "antd";
import CustomEmailTemplate from "./customEmailTemplete";
import { Modal as AndModal } from "antd";
import statuses from "../constants/statuses";
import Header2 from "./Header2";
const { TextArea } = Input;

function FadeMenu({ handleOpen1, setProject, projectData, setshowEmailModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditClick = () => {
    setProject(projectData); // Set the specific project data
    handleOpen1(); // Open the modal
    handleClose(); // Close the menu
  };
  const openProjectWBS = async () => {
    if (!projectData?._id) return;
    try {
      const response = await axios.get(
        backend_url + "/getSingleProjectById/" + projectData?._id
      );
      console.log(
        projectData,
        response,
        " ===> response while getting single project for wbs"
      );
      dispatch(
        setProjectData({
          ...response.data,
          toShowManager:
            Array.isArray(response.data?.assignManager) &&
            response.data?.assignManager?.length > 0
              ? response.data?.assignManager
              : [],
        })
      );
      navigate("/Ganttchatv2");
    } catch (error) {
      console.log(error, " ===> Error while fetching single project");
    }
  };
  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img src={Icon} />
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
        <MenuItem
          onClick={handleEditClick}
          className="!m-1 !border-none rounded hover:!bg-gray-200"
        >
          <div className="d-flex gap-2" style={{ color: "black" }}>
            {/* <img src={edit} /> */}
            <FaPencilAlt size={16} />
            <div>
              Edit <span className="!opacity-0">Edit all details here</span>
            </div>
          </div>
        </MenuItem>
        <MenuItem
          className="!m-1 !border-none rounded hover:!bg-gray-200"
          onClick={openProjectWBS}
        >
          {" "}
          <div className="d-flex gap-2" style={{ color: "black" }}>
            {/* <img src={view} /> */}
            <EyeFilled size={16} />
            <div>View</div>
          </div>
        </MenuItem>
        <MenuItem
          className="!m-1 !border-none rounded hover:!bg-gray-200"
          onClick={() => {
            setshowEmailModal(true);
          }}
        >
          {" "}
          <div className="d-flex gap-2" style={{ color: "black" }}>
            <MailFilled size={16} />
            <div>Email</div>
          </div>
        </MenuItem>
        <MenuItem
          className="!m-1 !border-none rounded hover:!bg-gray-200"
          onClick={() => setshowEmailModal(true)}
        >
          <div className="d-flex gap-2 items-center text-black">
            <PrinterFilled size={16} />
            <div>Print</div>
          </div>
        </MenuItem>

        <MenuItem
          className="!m-1 !border-none rounded hover:!bg-gray-200"
          onClick={() => setshowEmailModal(true)}
        >
          <div className="d-flex gap-2 items-center text-black">
            <ImportOutlined size={18} />
            <div>Import Time Schedule</div>
          </div>
        </MenuItem>

        <MenuItem
          className="!m-1 !border-none rounded hover:!bg-gray-200"
          onClick={() => setshowEmailModal(true)}
        >
          <div className="d-flex gap-2 items-center text-black">
            <FaFileDownload size={16} />
            <div>Export Time Schedule</div>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
export default function Createobs() {
  console.log(backend_url, " ===> backend url here");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open1, setOpen1] = useState(false);
  const [project, setProject] = useState();

  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const handleChangeHandle = (e) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    // Update project logic here
    console.log("Updated project:", project);
    handleClose1();
  };
  // Modal state
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(false);

  const [obsData, setObsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchObsData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios.get(
          backend_url + `/allProject/${user?._id}`
        );
        setObsData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        // Swal.fire("Error", "Failed to fetch OBS data", "error");
      }
    };

    fetchObsData();
  }, [userId]);
  const [newProject, setNewProject] = useState({
    projectNumber: "",
    projectName: "",
    managingCompany: "OSB",
    ownerRepresentative: "",
    dueDate: "",
    task: "",
    status: "Pending",
    category: "",
    description: "", // Added description field
  });
  const [obs, setObs] = useState({
    Organization: "",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(2);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredObsData = React.useMemo(
    () =>
      obsData
        .map((project) => ({
          ...project,
          dueDate: formatDate(project.dueDate),
        }))
        .filter((project) =>
          project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [obsData, searchQuery]
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObs((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Retrieve user from local storage when the component mounts
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user._id);
    }
  }, []);
  const handleCreate = async () => {
    try {
      const response = await axios.post(backend_url + "/createObs", {
        userId,
        description: obs.description,
        organization: obs.Organization,
      });

      if (response.data.success) {
        console.log(response.data.message);
        dispatch(setSelectedOBS(response.data.newobs));
        handleClose();
        navigate("/universalconstruction");
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error(
        "Error creating OBS:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

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
      title: "Manager Representative",
      dataIndex: "assignManager",
      align: "center",
      render: (assignManager) => assignManager?.[0]?.firstName || "-",
    },
    {
      title: "Owner Representative",
      dataIndex: "userId",
      align: "center",
      render: (userId) => userId?.name || "-",
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
      render: (workingHours) =>
        `${Math.round(workingHours?.averageDailyHours)}/${
          workingHours?.totalWeeklyHours
        }`,
    },
    {
      title: "Status",
      dataIndex: "projectStatus",
      align: "center",
      render: (projectStatus) => (
        <div
          style={{
            color: "#0EA263", // Green color for active status
            fontSize: "14px",
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
      render: (text, record) => {
        return (
          <FadeMenu
            handleOpen1={handleOpen1}
            setProject={setProject}
            projectData={record}
            setshowEmailModal={setshowEmailModal}
          />
        );
      },
    },
  ];

  // Define columns
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
      // {
      //   Header: 'Managing Company',
      //   accessor: 'owner',
      // },
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
        Cell: ({ row }) => (
          <FadeMenu
            handleOpen1={handleOpen1}
            setProject={setProject}
            projectData={row.original}
          />
        ),
      },
    ],
    []
  );

  // Use the useTable hook to create the table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredObsData });
  const [obsData1, setObsData1] = useState([]);
  const [showEmailModal, setshowEmailModal] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  useEffect(() => {
    const fetchObsData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios.get(
          backend_url + "/allObs" + `/${user?._id}`
        );
        setObsData1(response.data);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch OBS data", "error");
      }
    };

    fetchObsData();
  }, []);

  const HOVERED_MARGIN_LEFT = "ml-[240px]";
  const UNHOVERED_MARGIN_LEFT = "ml-[80px]";
  const [isOpened, setisOpened] = useState(true);

  const toggleCollapsed = () => {
    setisOpened(!isOpened);
  };

  const components = {
    header: {
      cell: (props) => (
        <th
          {...props}
          style={{
            backgroundColor: "#007AB6", // Blue background like in the image
            color: "#ffffff", // White text
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            fontWeight: 600,
            padding: "12px 16px",
            textAlign: "left",
            borderBottom: "1px solid #E5E7EB"
          }}
        >
          {props.children}
        </th>
      ),
    },
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
        <div className="mainpage !px-10 !py-7" style={{ height: "calc(100vh - 80px)", overflow: "hidden" }}>
          <div className="row !p-0 !h-full">
            {/* <div className="col-md-1">
            </div> */}
            <div className="col-md-12 !p-0 !h-full">
              <div className="final__bg__09 !px-10 !py-8" style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div className="seaech__box___00" style={{ flexShrink: 0 }}>
                  <div className="flex justify-between items-center mb-6">
                    <div className="col-md-2 d-flex justify-content-start justiClass align-items-center">
                      <div className="s_09ssd justiClass">
                        <div className="!text-[#344054] !text-[16px] !font-[600] !m-0 !p-0">
                          Schedule
                        </div>
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
                            setSearchQuery(e.target.value);
                          },
                          allowClear: true,
                        }}
                      />
                      {/* Create OBS button */}
                      <CustomButton
                        text="Create OBS"
                        className="!w-fit !py-3 !px-5 !text-[14px] !min-w-[120px] !whitespace-nowrap"
                        icon={plussvg}
                        iconwidth={20}
                        iconheight={20}
                        onClick={handleOpen}
                      />
                      {/* Create New Project button */}
                      <Link to="/universalconstruction">
                        <CustomButton
                          text="Create New Project"
                          className="!w-fit !py-3 !px-5 !text-[14px] !min-w-[140px] !whitespace-nowrap"
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
                    // loading={state.loading || state.isUpdatingStatus}
                    className="rounded-lg border"
                    columns={columns1}
                    dataSource={filteredObsData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                    pagination={false}
                    components={components}
                    style={{ flex: 1, width: "100%" }}
                  />
                  
                  {/* Pagination outside table */}
                  <div className="flex justify-center items-center mt-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="bg-lavenderPurpleReplica rounded p-2.5 mx-1 text-white hover:bg-opacity-80 disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      >
                        <ArrowLeftOutlined style={{ fontWeight: "bolder" }} />
                      </button>
                      {Array.from({ length: Math.ceil(filteredObsData.length / pageSize) }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`rounded p-2.5 mx-1 border ${
                            currentPage === page 
                              ? "bg-lavenderPurpleReplica text-white" 
                              : "text-lavenderPurpleReplica border-lavenderPurpleReplica bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button 
                        className="bg-lavenderPurpleReplica rounded p-2.5 mx-1 text-white hover:bg-opacity-80 disabled:opacity-50"
                        disabled={currentPage >= Math.ceil(filteredObsData.length / pageSize)}
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredObsData.length / pageSize), prev + 1))}
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

        {/* Modal to send email */}
        <AndModal
          open={showEmailModal}
          setOpen={setshowEmailModal}
          closable={false}
          footer={null}
          centered={true}
          destroyOnClose={false}
          onCancel={(e) => {
            e.stopPropagation();
            //  handleCancel();
          }}
          width={"30%"}
          className="!bg-transparent"
          style={{ zIndex: 10000 }}
        >
          <CustomEmailTemplate
            isFileUploadShow={true}
            setEmailModal={setshowEmailModal}
            submitHandler={async (formData) => {
              console.log(formData, " ===> Form Data here");
              setIsSubmittingEmail(true);
              try {
                const token = localStorage.getItem("token");
                const response = await axios.post(
                  backend_url_core + "/api/email" + `/send`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                console.log(response, " ===> Response here");
                if (response.statusCode === 200 || response.status === 200) {
                  toast.success("Email sent successfully");
                  setshowEmailModal(false);
                }
              } catch (error) {
                const err = error;
                toast.error(err.response?.data.message);
              } finally {
                setIsSubmittingEmail(false);
              }
            }}
            to={""}
            isSubmitting={isSubmittingEmail}
          />
        </AndModal>

        {/* Modal for creating a new project */}
        <Modal
          centered
          open={open}
          footer={null}
          onCancel={handleClose}
          closable={false}
          className="!p-0"
        >
          <Box sx={{ ...style }} className="obsmodal">
            <div className="px-6">
              <h1 className="text-[28px] font-semibold text-[#1D2939] mb-4 text-center">
                Create OBS Structure
              </h1>

              <Card className="rounded-xl !border-[#007AB6] p-2 !border">
                <div className="bg-[#0071BC] text-white p-3 rounded-xl flex justify-between items-center">
                  <span className="text-[14px] font-medium">
                    Current OBS Projects
                  </span>
                  <span className="rotate-180 text-[20px]">
                    <IoIosArrowDown size={24} className="rotate-180" />
                  </span>
                </div>

                <div className="p-3 border-t border-[#E4E7EC] bg-[#F9FAFB]">
                  <span className="flex items-center text-[#007AB6] font-semibold text-[16px] gap-2">
                    <span className="text-[24px]">
                      <HomeFilled />
                    </span>{" "}
                    Universal Construction
                  </span>
                </div>

                <div className="px-4 pt-4 pb-6">
                  <h3 className="text-[18px] font-semibold text-[#101828] mb-3">
                    Create New OBS
                  </h3>

                  <div className="flex flex-col gap-1 mb-4">
                    <label className="text-[12px] text-[#464646]">
                      Organisation Name
                    </label>
                    <Input
                      placeholder="Enter Name"
                      name="Organization"
                      value={obs.Organization}
                      onChange={handleChange}
                      className="!p-2 !rounded-[8px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] text-[#464646]">
                      Description
                    </label>
                    <TextArea
                      placeholder=""
                      name="description"
                      value={obs.description}
                      onChange={handleChange}
                      className="!p-2 !rounded-[8px]"
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-center gap-4 mt-5">
                <Button
                  onClick={handleClose}
                  className="!border !border-[#F2F4F7] text-[#6941C6] text-[14px] py-2.5 w-[137px] rounded-lg shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCreate(obs)}
                  className="!bg-[#007AB6] text-white text-[14px] !py-2.5 w-[177px] rounded-xl shadow-sm"
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
        />
      </div>
    </>
  );
}

const style = {
  position: "absolute",
  width: "928px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px", // Rounded corners
};
