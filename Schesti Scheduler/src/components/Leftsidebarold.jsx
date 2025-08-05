import React, { useState } from "react";
// import JSGanttComponent from 'react-jsgantt';
import logo from "../images/logoss.svg";
import iconleft from "../images/ii1.svg";
import iconleft2 from "../images/ii2.svg";
import iconleft3 from "../images/ii3.svg";
import iconleft4 from "../images/ii4.svg";
import iconleft5 from "../images/ii5.svg";
import iconleft6 from "../images/ii6.svg";
import iconleft7 from "../images/ii7.svg";
import iconleft8 from "../images/ii8.svg";
import iconleft9 from "../images/ii9.svg";
import iconleft10 from "../images/ii10.svg";
import iconleft11 from "../images/ii11.svg";
import { Link, useLocation } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { MdOutlineMenu } from "react-icons/md";

import { Nav } from "react-bootstrap";

export default function Leftsidebar() {
  const location = useLocation();
  const pathname = location.pathname; // "/createobs"
  const segment = pathname.split("/")[1];
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [activeIndex, setActiveIndex] = useState(activeIndex1);

  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    setActiveIndex1(index);
  };
  console.log("activeIndex", activeIndex1);

  return (
    <>
    
    <div variant="primary" className="text-red cursor-pointer  menuClass  block    absolute lg:hiiden  " onClick={handleShow}>
    <MdOutlineMenu    size={40} />
      </div>
      <Offcanvas show={show} onHide={handleClose} className="bg-[#007ab6] block   menuClass lg:hiiden "  style={{background:"#007ab6"}}  >
        <Offcanvas.Header closeButton>
      
      
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div className="left__sidebar">
        <div className="logo__admin">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <div className="link__links flex flex-col">
          <ul>
            <li
              className={segment === "" ? "active_110 tooltips" : "tooltips"}
              onClick={() => handleItemClick(0)}
            >
              <span class="tooltiptext">Projeect/OBS List</span>
              <Link to="/">
                <IoHomeSharp fill="white" size={25} />
              </Link>
            </li>
            <li
              className={
                segment === "createobs" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(1)}
            >
              <span class="tooltiptext">Users List</span>
              <Link to="/users">
                <img src={iconleft2} alt="iconleft2" />
              </Link>
            </li>
            <li
              className={
                segment === "universalconstruction"
                  ? "active_110 tooltips"
                  : "tooltips"
              }
              onClick={() => handleItemClick(2)}
            >
              <span class="tooltiptext">Create Project </span>
              <Link to="/universalconstruction">
                <img src={iconleft3} alt="iconleft3" />
              </Link>
            </li>
            <li
              className={
                segment === "resources" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(3)}
            >
              <span class="tooltiptext">Resources </span>
              <Link to="/resources">
                <img src={iconleft4} alt="iconleft4" />
              </Link>
            </li>
            <li
              className={
                segment === "role" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(4)}
            >
              <span class="tooltiptext">Role/Department</span>
              <Link to="/role">
                <img src={iconleft5} alt="iconleft5" />
              </Link>
            </li>

            <li
              className={
                segment === "activities" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(7)}
            >
              <span class="tooltiptext">Activities</span>
              <Link to="/activities">
                <img src={iconleft8} alt="iconleft8" />
              </Link>
            </li>
            <li
              className={
                segment === "Ganttchatv2" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(8)}
            >
              <span class="tooltiptext">WBS </span>
              <Link to="/Ganttchatv2">
                <img src={iconleft9} alt="iconleft9" />
              </Link>
            </li>

            <li
              className={
                segment === "createyourprojectschedules"
                  ? "active_110 tooltips"
                  : "tooltips"
              }
              onClick={() => handleItemClick(10)}
            >
              <span class="tooltiptext">Settings </span>
              <a href="#">
                <img src={iconleft11} alt="iconleft11" />
              </a>
            </li>
          </ul>
        </div>
      </div>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="left__sidebar hidden menuClass1  lg:block">
        <div className="logo__admin">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <div className="link__links">
          <ul>
            <li
              className={segment === "" ? "active_110 tooltips" : "tooltips"}
              onClick={() => handleItemClick(0)}
            >
              <span class="tooltiptext">Projeect/OBS List</span>
              <Link to="/">
                <IoHomeSharp fill="white" size={25} />
              </Link>
            </li>
            <li
              className={
                segment === "createobs" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(1)}
            >
              <span class="tooltiptext">Users List</span>
              <Link to="/users">
                <img src={iconleft2} alt="iconleft2" />
              </Link>
            </li>
            <li
              className={
                segment === "universalconstruction"
                  ? "active_110 tooltips"
                  : "tooltips"
              }
              onClick={() => handleItemClick(2)}
            >
              <span class="tooltiptext">Create Project </span>
              <Link to="/universalconstruction">
                <img src={iconleft3} alt="iconleft3" />
              </Link>
            </li>
            <li
              className={
                segment === "resources" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(3)}
            >
              <span class="tooltiptext">Resources </span>
              <Link to="/resources">
                <img src={iconleft4} alt="iconleft4" />
              </Link>
            </li>
            <li
              className={
                segment === "role" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(4)}
            >
              <span class="tooltiptext">Role/Department</span>
              <Link to="/role">
                <img src={iconleft5} alt="iconleft5" />
              </Link>
            </li>

            <li
              className={
                segment === "activities" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(7)}
            >
              <span class="tooltiptext">Activities</span>
              <Link to="/activities">
                <img src={iconleft8} alt="iconleft8" />
              </Link>
            </li>
            <li
              className={
                segment === "Ganttchatv2" ? "active_110 tooltips" : "tooltips"
              }
              onClick={() => handleItemClick(8)}
            >
              <span class="tooltiptext">WBS </span>
              <Link to="/Ganttchatv2">
                <img src={iconleft9} alt="iconleft9" />
              </Link>
            </li>

            <li
              className={
                segment === "createyourprojectschedules"
                  ? "active_110 tooltips"
                  : "tooltips"
              }
              onClick={() => handleItemClick(10)}
            >
              <span class="tooltiptext">Settings </span>
              <a href="#">
                <img src={iconleft11} alt="iconleft11" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
