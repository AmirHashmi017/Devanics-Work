import React from 'react';
import "../styles/Sidebar.css"
import "../styles/Components.css"
import "../styles/dashboard.css"

const Sidebar = () => {
  return (<div className="sidebar">
        <div className="sidebar__logo">
          <img className="sidebar__logo-icon" src="../assets/Illustration.png"/>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__nav-item">
            <span><img src="../assets/Group.png"></img></span>
            <span>Test Library</span>
          </div>
          <div className="sidebar__nav-item">
            <span><img src="../assets/payment.png"></img></span>
            <span>Payments</span>
          </div>
          <div className="sidebar__nav-item">
            <span><img src="../assets/candidates.png"></img></span>
            <span>My candidates</span>
          </div>
          <div className="sidebar__nav-item">
            <span><img src="../assets/Profile.png"></img></span>
            <span>My profile</span>
          </div>
          <div className="sidebar__nav-item sidebar__nav-item--active">
            <span><img src="../assets/recuriment.png"></img></span>
            <span>My Recruitment</span>
          </div>
          <p className="sidebar__footer-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </nav>

        <div className="sidebar__footer">
          
          <button className="sidebar__upgrade-btn">Upgrade Now</button>
        </div>
      </div>)
}
export default Sidebar
