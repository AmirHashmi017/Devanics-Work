import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./components/redux/store"; // Adjust the path as per your project structure
import "bootstrap/dist/css/bootstrap.min.css";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "wx-react-gantt/dist/gantt.css";
import "./index1.css";
import "./index.css";
// import 'antd/dist/antd.css'; // Import Ant Design styles

import Createobs from "./components/Createobs";
import Universalconstruction from "./components/Universalconstruction";
import Schedule from "./components/Schedule";
import Createyourprojectschedule from "./components/Createyourprojectschedule";
import Gantt_chart_universal from "./components/Gantt_chart_universal";
import Wbs from "./components/Wbs";
import Ganttchatv2 from "./components/Ganttchatv2";
import Ganttchatvtwo from "./components/Ganttchatvtwo";
import Calender from "./components/Calender";
import Signin from "./components/Signin";
import SignUp from "./components/Signup";
import Calender2 from "./components/Calender2";
import NewGanttChart from "./components/NewGanttChart";
import NewActivity from "./components/NewActivity";
import Resources from "./components/Resources/main";
import Users from "./components/User/main";
import Role from "./components/Role/main";
import { shesti_original_app_url } from "./constants/api";
import { jwtDecode } from "jwt-decode";

function Index() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded, " ====> JWT decoded here");
      // Store the token and clear the query string
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(decoded));
      window.history.replaceState(null, "", "/"); // Remove token from URL
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Access denied. Redirecting to login.");
      window.location.href = shesti_original_app_url + "/sign-in";
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Createobs />} />
            <Route
              path="/universalconstruction"
              element={<Universalconstruction />}
            />
            <Route path="/resources" element={<Resources />} />
            <Route path="/users" element={<Users />} />
            <Route path="/role" element={<Role />} />
            <Route
              path="/createyourprojectschedule"
              element={<Createyourprojectschedule />}
            />
            <Route
              path="/createyourprojectschedulee"
              element={<Createyourprojectschedule />}
            />
            <Route
              path="/createyourprojectschedules"
              element={<Createyourprojectschedule />}
            />

            <Route
              path="/gantt_chart_universal"
              element={<Gantt_chart_universal />}
            />
            <Route path="/wbs" element={<Wbs />} />
            <Route path="/Ganttchatv" element={<Ganttchatv2 />} />
            <Route path="/Ganttchatv2" element={<NewGanttChart />} />
            <Route path="/activities" element={<NewActivity />} />
            <Route path="/calender" element={<Calender />} />
            <Route path="/calender2" element={<Calender2 />} />
            <Route path="/schedule" element={<Schedule />} />
            {/* <Route path="*" element={<App />} /> Default route */}
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}
ReactDOM.render(<Index />, document.getElementById("root"));
