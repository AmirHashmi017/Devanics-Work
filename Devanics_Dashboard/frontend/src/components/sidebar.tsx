import {useState,useEffect} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import "../styles/Sidebar.css"
import "../styles/Components.css"
import "../styles/dashboard.css"


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>('recruitment');

  useEffect(() => {
    if (location.pathname === '/profile/create') {
      setActiveItem('profile');
    } else if (location.pathname === '/profiles') {
      setActiveItem('recruitment');
    }
  }, [location.pathname]);

  const handlenewprofileClick = () => {
    setActiveItem('profile');
    navigate('/profile/create'); 
  };
   const profilesClick = () => {
    setActiveItem('recruitment');
    navigate('/profiles'); 
  };
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
          <div className={`sidebar__nav-item ${activeItem === 'profile' ? 'sidebar__nav-item--active' : ''}`} onClick={handlenewprofileClick}>
            <span><img src="../assets/Profile.png"></img></span>
            <span>My profile</span>
          </div>
          <div className={`sidebar__nav-item ${activeItem === 'recruitment' ? 'sidebar__nav-item--active' : ''}`} onClick={profilesClick}>
            <span><img src="../assets/recuriment.png"></img></span>
            <span>My Recruitment</span>
          </div>
          <button className="sidebar__upgrade-btn">Upgrade Now</button>
        </nav>

        
      </div>)
}
export default Sidebar
