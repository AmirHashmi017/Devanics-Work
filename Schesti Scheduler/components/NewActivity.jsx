import React, { useEffect, useState } from "react";
import Header from "./Header";
import Leftsidebar from "./Leftsidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";
import $ from "jquery";
import { useSelector } from "react-redux";
import _ from "lodash";
import Createyourprojectschedule from "./Createyourprojectschedule";
import { backend_url, backend_url_core } from "../constants/api";
import Header2 from "./Header2";
const arraysEqual = (arr1, arr2) => {
  return _.isEqual(arr1, arr2);
};

const NewActivity = () => {
  const project = useSelector((state) => state.project.data);
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [userId, setUserId] = useState();
  const [projectId, setProjectId] = useState();
  const [tasks, setTasks] = useState([]);
  const [chart, setChart] = useState(null);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    if (shouldReload) {
    }
  }, [shouldReload]);

  useEffect(() => {
    setUserId(userData?._id);
    setProjectId(project?._id);
    if (userData?._id && project?._id) fetchChart(userData?._id, project?._id);
  }, []);

  const fetchChart = async (user, project) => {
    setLoading(true);
    try {
      const response = await axios.get(
        backend_url + `/chartsA/${user}/${project}`
      );
      setTasks(response.data?.tasks);
      const responseRes = await axios.get(backend_url + `/resource/${user}`);
      // const rolesRes = await axios.get(
      //     backend_url+`/users/${user}`
      // );
      // const rolesRes = [];

      const token = localStorage.getItem("token");
      const rolesRes = await axios.get(
        // backend_url_core+`/api/user/users/${user?._id}`
        backend_url_core + `/api/user/users?page=1&limit=1000&queryRoles=`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //   console.log(response.data, " ===> users response")
      //   setUsers(response.data?.data?.employees);

      setChart(response.data);
      const element = document.getElementById("#workSpace");

      if (element) {
        element.remove();
      }
      let fg = responseRes.data?.map((d) => ({
        id: d?._id,
        name: d?.Name + " - " + d?.Type,
      }));
      let gg = Array.isArray(response.data?.data?.employees)
        ? response.data?.data?.employees?.map((d) => ({
            id: d?._id,
            name: d?.firstName + " " + d?.lastName + " - " + d?.roleType,
          }))
        : [];
      if (typeof window.externalFunction === "function") {
        const result = window.externalFunction(response.data?.tasks, fg, gg);
        
        // Ensure proper date formatting in the Gantt chart
        if (window.ge) {
          // Set proper date format for timeline with date ranges
          window.ge.config.date_scale = "custom";
          window.ge.config.min_column_width = 60;
          
          // Set custom date scale template for week view
          window.ge.templates.date_scale = function(date) {
            const d = new Date(date);
            const startOfWeek = new Date(d);
            startOfWeek.setDate(d.getDate() - d.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            const startDay = startOfWeek.getDate();
            const endDay = endOfWeek.getDate();
            const month = startOfWeek.toLocaleDateString('en', {month: 'short'});
            
            return `${startDay} ${month} to ${endDay} ${month}`;
          };
          
          // Auto-scroll to show current tasks
          if (response.data?.tasks && response.data.tasks.length > 0) {
            const firstTask = response.data.tasks[0];
            if (firstTask.start) {
              const taskStartDate = new Date(firstTask.start);
              window.ge.showDate(taskStartDate);
            }
          }
          
          // Re-render with updated settings
          setTimeout(() => {
            window.ge.setSizes();
            window.ge.render();
          }, 100);
        }
      }
      setCheck(true);
      setIsLoaded(true);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const changeF = () => {
    const fgf = document.getElementById("coden");
    const fgff = document.getElementById("nameColumn");
    if (fgf) fgf.innerText = "Activity ID";
    if (fgff) fgff.innerText = "Activity Name";
  };

  const updateTasks = async (updatedTasks) => {
    try {
      const response = await axios.put(
        backend_url + `/chartsA/${userId}/${projectId}`,
        {
          tasks: updatedTasks,
          version: chart?.__v,
        }
      );
      setChart(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  const saveTaskData = () => {
    // Don't use saveProject() to avoid clone errors
    if (window.ge && window.ge.tasks && window.ge.tasks.length > 0) {
      const currentTasks = window.ge.tasks;
      if (!arraysEqual(currentTasks, tasks)) {
        setTasks(currentTasks);
        updateTasks(currentTasks);
      }
    }
  };

  // const debouncedSaveTaskData = debounce(saveTaskData, 2000);

  // useEffect(() => {
  //     const handleInputChange = () => {
  //         debouncedSaveTaskData();
  //     };

  //     $(document).on("input change", ".taskEditRow input", handleInputChange);

  //     $(document).on(
  //         "change input",
  //         ".taskEditRow input[type='date']",
  //         handleInputChange
  //     );

  //     return () => {
  //         $(document).off("input change", ".taskEditRow input", handleInputChange);
  //         $(document).off(
  //             "change input",
  //             ".taskEditRow input[type='date']",
  //             handleInputChange
  //         );
  //     };
  // }, [tasks]);
  useEffect(() => {
    let intervalId;

    // Initial delay of 2 seconds before starting the interval
    const initialTimeoutId = setTimeout(() => {
      // Don't use saveProject() to avoid clone errors
      let projectTasks = window.ge?.tasks || [];

      if (projectTasks && projectTasks.length > 0) {
        let levelCodes = {}; // To store codes for each level
        let maxLevel = 0;

        // Initialize levelCodes for each level and find the highest level
        projectTasks?.forEach((task) => {
          if (!(task.level in levelCodes)) {
            levelCodes[task.level] = [];
          }
          if (task.level > maxLevel) {
            maxLevel = task.level;
          }
        });

        // Collect existing codes
        projectTasks?.forEach((task) => {
          if (task.code !== "") {
            levelCodes[task.level].push(task.code);
          }
        });

        // Function to generate codes for a specific level
        function generateCode(level, index) {
          // Get the code of the highest level as a prefix
          let parentCode = "";
          if (level > 0) {
            // Use the highest level's code as the base if available
            parentCode = levelCodes[level - 1][0] || "0";
          }
          let nextIndex = (index + 1).toString().padStart(2, "0");
          return `${parentCode}-${nextIndex}`;
        }

        // Generate codes for tasks starting from the highest level
        for (let currentLevel = maxLevel; currentLevel >= 0; currentLevel--) {
          projectTasks
            .filter((task) => task.level === currentLevel && task.code === "")
            ?.forEach((task, index) => {
              task.code = generateCode(
                currentLevel,
                levelCodes[currentLevel].length
              );
              levelCodes[currentLevel].push(task.code);
            });
        }

      }

      if (!arraysEqual(projectTasks, tasks)) {
        setTasks(projectTasks);
        updateTasks(projectTasks);
      }
      intervalId = setInterval(() => {
        // Don't use saveProject() to avoid clone errors
        let currentTasks = window.ge?.tasks || [];
        if (!arraysEqual(currentTasks, tasks)) {
          setTasks(currentTasks);
          updateTasks(currentTasks);
        }
      }, 1000);
    }, 5000);

    // Cleanup function to clear the timeout and interval
    return () => {
      clearTimeout(initialTimeoutId);
      clearInterval(intervalId);
    };
  }, [tasks]);

  const HOVERED_MARGIN_LEFT = "ml-[240px]";
  const UNHOVERED_MARGIN_LEFT = "ml-[80px]";
  const [isOpened, setisOpened] = useState(true);

  const toggleCollapsed = () => {
    setisOpened(!isOpened);
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
        <div className="mainpage !p-0 !max-h-[95vh] !overflow-y-auto">
          <div className="row !p-0 !h-full">
            {/* <div className="col-md-1">
                            <Leftsidebar />
                        </div> */}

            <div className="col-md-12 !p-6 !h-full">
              <Createyourprojectschedule totalTasks={Array.isArray(tasks) ? tasks.length : 0} />
              <div className="main_nav_me nu d-flex justify-between gap-5 px-3 pb-3">
                <div>
                  <Link
                    to="/Ganttchatv2"
                    style={{ textDecoration: "none", color: "#667085" }}
                  >
                    <div className=" ">WBS</div>
                  </Link>
                  <Link to="/activities" style={{ textDecoration: "none" }}>
                    <div className=" ">Activities</div>
                  </Link>
                  <Link to="/Ganttchatv2" style={{ textDecoration: "none" }}>
                    <div className=" ">Projects</div>
                  </Link>
                </div>
                <div className="flex-1 !text-black !z-50"><Link to="/Ganttchatv2" style={{ textDecoration: "none" }}>
                    <div className=" ">Projects</div>
                  </Link></div>
              </div>
              <div style={{ position: "relative", minHeight: "calc(100vh - 400px)" }}>
                <div
                  // onClick={() => {
                  //     setTimeout(() => {
                  //         let project = window.ge.saveProject();
                  //         console.log("sdsd", project?.tasks, tasks);
                  //         if (!arraysEqual(project?.tasks, tasks)) {
                  //             console.log("Arrays have changed.");
                  //             setTasks(project?.tasks);
                  //             updateTasks(project?.tasks);
                  //         } else {
                  //             console.log("Arrays are equal.");
                  //         }
                  //     }, 2000);
                  // }}
                  id="workSpace"
                  style={{
                    padding: "0px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    // border: "1px solid #e5e5e5",
                    position: "relative",
                    margin: "0 5px",
                    // width: "100%",
                    minHeight: "calc(100vh - 450px)",
                    // background: "white",
                    textTransform: "capitalize",
                    // paddingTop: "40px"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewActivity;
