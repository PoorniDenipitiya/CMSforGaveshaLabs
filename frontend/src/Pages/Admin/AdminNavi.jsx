import React,{useState, useEffect} from "react";
//import { useState, useEffect } from "react";
//import { ReactDOM } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faBell, faHome, faMicrochip, faBook, faBlog, faCartShopping, faUser, faChartLine, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./AdminNavi.css";
import AdminDropdown from "./AdminDropdown";
import { useUsers } from "../../Context/UserContext";
import Gaveshalogo from './Assets/Gaveshalogo.png';


export const AdminNavi = ({ totalPendingCount = 0, projectCounts = {}, resourceCounts = {} }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { user, fetchUsers } = useUsers();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
 
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  
  return (
    <div>
      <div className="admin_container">
        <div className="admin_line_grid">
          <nav className="admin_nav">
            <img src={Gaveshalogo} alt="Description" style={{height:"50px", paddingTop:"15px", marginLeft:"50px"}}/>
           
          </nav>
          <div className="admin_nav_grid">
            <li className="admin_notification-icon">
              <a href="#">
                <FontAwesomeIcon icon={faBell} />
                {totalPendingCount > 0 && <span className="admin_notification-count">{totalPendingCount}</span>}
              </a>
              <span className="admin_tooltip">Projects pending approval: {totalPendingCount}</span>
              <div className="admin_notification-box">
              <ul className="admin-list">
              <li> <p>You have {projectCounts.pending || 0} projects for pending approval.</p></li> 
              <li>  <p> You have {resourceCounts.pending || 0} resources for pending approval.</p></li>
              </ul>
              </div>
            </li>
            <li>
            <div className="menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
            <FontAwesomeIcon icon={faUserCircle} />
          
          {isDropdownVisible && <AdminDropdown />}
        </div>
             { /*
              <a href="#">
                <FontAwesomeIcon icon={faUserCircle} />
              </a>
              */}
            </li>
          </div>
        </div>

        <div className="admin_sidebar-container">
          <div className="admin_nav-option">
          <li className={activeLink === '/admin' ? 'active' : ''}>
          <Link to="/admin" onClick={() => handleLinkClick('/admin')}>           
               <FontAwesomeIcon icon={faHome} /> Dashboard
              </Link>
            </li>

            <li className={activeLink === '/proadmin' ? 'active' : ''}>
              <Link to="/proadmin" onClick={() => handleLinkClick('/proadmin')}>
                <FontAwesomeIcon icon={faMicrochip} /> Projects
              </Link>
            </li>

            <li className={activeLink === '/resoadmin' ? 'active' : ''}>
              <Link to="/resoadmin" onClick={() => handleLinkClick('/resoadmin')}>
                <FontAwesomeIcon icon={faBook} /> Resources
              </Link>
            </li>

            <li className={activeLink === '/blogsadmin' ? 'active' : ''}>
              <Link to="/blogsadmin" onClick={() => handleLinkClick('/blogsadmin')}>
                <FontAwesomeIcon icon={faBlog} /> Blogs
              </Link>
            </li>

         <li className={activeLink === '/shoppingsadmin' ? 'active' : ''}>
              <Link to="/shoppingsadmin" onClick={() => handleLinkClick('/shoppingsadmin')}>
                <FontAwesomeIcon icon={faCartShopping} /> Shopping
              </Link>
            </li>

     { /*     <Link to={'/usersadmin'}> <li>
              <a href="#">
                <FontAwesomeIcon icon={faUser} /> Users{" "}
              </a>
            </li></Link> */}

<li className={activeLink === '/performanceadmin' ? 'active' : ''}>
              <Link to="/performanceadmin" onClick={() => handleLinkClick('/performanceadmin')}>
                <FontAwesomeIcon icon={faChartLine} /> Performance
              </Link>
            </li> 

          </div>
        </div>
      </div>
      
    

      {/* <FontAwesomeIcon icon="fa-solid fa-bars" /> */}

    </div>
  );
};

export default AdminNavi;