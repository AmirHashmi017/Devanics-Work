import { useState } from "react";
import Leftsidebar from "./Leftsidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Createyourprojectschedule from "./Createyourprojectschedule";
import Header2 from "./Header2";
import GanttViewer from "./GanttView";
// import { Spin } from "antd";

const NewGanttChart = () => {
  const project = useSelector((state) => state.project?.data);

  const HOVERED_MARGIN_LEFT = "ml-[240px]";
  const UNHOVERED_MARGIN_LEFT = "ml-[80px]";
  const [isOpened, setisOpened] = useState(true);
  const tasks = [];
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
        {/* {loading && <Spin fullscreen />} */}
        <div className="mainpage !p-0 !max-h-[93vh] !overflow-y-auto">
          <div className="row !p-0 !h-full">
            <div className="col-md-12 !h-full !p-6" style={{ overflow: 'visible' }}>
              <Createyourprojectschedule tasks={tasks?.length} />
              <div className="main_nav_me nu d-flex  gap-5 px-3 pb-3">
                <div className="flex gap-5">
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
              </div>

              <GanttViewer project={project} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewGanttChart;
