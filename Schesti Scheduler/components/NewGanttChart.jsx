import { useState, useEffect, useCallback } from "react";
import Leftsidebar from "./Leftsidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Createyourprojectschedule from "./Createyourprojectschedule";
import Navbar from "./Navbar";
import GanttViewer from "./GanttView";
import axios from "axios";
import { backend_url } from "../constants/api";
import { backend_url_core } from "../constants/api"

const NewGanttChart = () => {
  const project = useSelector((state) => state.project?.data);
  const [userId, setUserId] = useState(false)
  const [userDetails, setUserDetails] = useState(null);
  const selectedObs = useSelector((state) => state.project?.selectedObs); // Add selectedObs
  const HOVERED_MARGIN_LEFT = "ml-[240px]";
  const UNHOVERED_MARGIN_LEFT = "ml-[80px]";
  const [isOpened, setIsOpened] = useState(true);
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("activities");
  const [tasks, setTasks] = useState([]);

  // Fetch tasks initially
  const fetchTasks = useCallback(async () => {
    if (!project?._id || !selectedObs?.userId) {
      console.warn("Missing project ID or user ID:", { projectId: project?._id, userId: selectedObs?.userId });
      setTasks([]);
      return;
    }
    try {
      const response = await axios.get(`${backend_url}/charts/${selectedObs.userId}/${project._id}`);
      console.log("Fetch tasks response:", response.data); // Debug log
      setTasks(response.data?.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error.response?.data || error.message);
      setTasks([]);
    }
  }, [project, selectedObs]);

  // Refetch function to pass down
  const refetchTasks = useCallback(async () => {
    if (!project?._id || !selectedObs?.userId) {
      console.warn("Missing project ID or user ID for refetch:", { projectId: project?._id, userId: selectedObs?.userId });
      return;
    }
    try {
      const response = await axios.get(`${backend_url}/charts/${selectedObs.userId}/${project._id}`);
      console.log("Refetch tasks response:", response.data); // Debug log
      setTasks(response.data?.tasks || []);
    } catch (error) {
      console.error("Failed to refetch tasks:", error.response?.data || error.message);
    }
  }, [project, selectedObs]);

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
    fetchTasks();
  }, [fetchTasks]); // Use memoized fetchTasks

  // Update isVisualizationOpen based on activeTab
  useEffect(() => {
    if (activeTab === "projects" || activeTab === "wbs") {
      setIsVisualizationOpen(false);
    } else if (activeTab === "activities") {
      setIsVisualizationOpen(true);
    }
  }, [activeTab]);

  const toggleCollapsed = () => {
    setIsOpened(!isOpened);
  };

  const toggleVisualization = () => {
    setIsVisualizationOpen(!isVisualizationOpen);
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
        <div className="mainpage !p-0 !max-h-[93vh] !overflow-y-auto">
          <div className="row !p-0 !h-full">
            <div className="col-md-12 !h-full !p-6" style={{ overflow: "visible" }}>
              <Createyourprojectschedule totalTasks={tasks.length} />
              <div className="flex items-center gap-4 px-3 py-1 text-sm border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Link
                    to="/Ganttchatv2"
                    onClick={() => setActiveTab("activities")}
                    className={activeTab === "activities" ? "text-blue-600 font-medium" : "text-black"}
                  >
                    Activities
                  </Link>
                  <Link
                    to="/Ganttchatv2"
                    onClick={() => setActiveTab("wbs")}
                    className={activeTab === "wbs" ? "text-blue-600 font-medium" : "text-black"}
                  >
                    WBS
                  </Link>
                  <Link
                    to="/Ganttchatv2"
                    onClick={() => setActiveTab("projects")}
                    className={activeTab === "projects" ? "text-blue-600 font-medium" : "text-black"}
                  >
                    Projects
                  </Link>
                  
                </div>
              </div>
              <div className="w-full" style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}>
                <GanttViewer
                  project={project}
                  isVisualizationOpen={isVisualizationOpen}
                  onToggleVisualization={toggleVisualization}
                  activeTab={activeTab}
                  onTasksChange={refetchTasks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewGanttChart;