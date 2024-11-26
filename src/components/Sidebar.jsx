import React from 'react';
import { BsGrid1X2Fill, BsFillArchiveFill, BsFillGearFill } from 'react-icons/bs';
import { RiTeamFill } from "react-icons/ri";
import { ImBin2 } from "react-icons/im";
import { BiLogOut } from "react-icons/bi";
import PropTypes from "prop-types";

function Sidebar({ openSidebarToggle, OpenSidebar, changePage }) {
  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <ImBin2 className="icon_header" /> TrashBin System
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <div className="sidebar-user">
        <span className="user-name">
          {user ? user.username : ""}
        </span>
        <span className="user-email">
          {user ? user.email : ""}
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="#" onClick={() => changePage('Dashboard')}>
            <BsGrid1X2Fill className="icon" /> Dashboard
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="#" onClick={() => changePage('Products')}>
            <BsFillArchiveFill className="icon" /> Historic Data
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="#" onClick={() => changePage('AboutUs')}>
            <BsFillGearFill className="icon" /> About The Project
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="#" onClick={() => changePage('OurTeam')}>
            <RiTeamFill className="icon" /> Our Team
          </a>
        </li>
        <li className="sidebar-list-item">
          <a onClick={logout}>
            <BiLogOut className="icon" /> Logout
          </a>
        </li>
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  openSidebarToggle: PropTypes.bool,
  OpenSidebar: PropTypes.func,
  changePage: PropTypes.func, // Assuming changePage is a function passed as a prop
};

export default Sidebar;
