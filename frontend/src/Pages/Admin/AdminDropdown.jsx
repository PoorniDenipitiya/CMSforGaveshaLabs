import React from "react";
import { Link } from "react-router-dom";
import "./AdminDropdown.css";
import { useUsers } from "../../Context/UserContext";

const DropdownMenu = () => {
  const { user, fetchUsers } = useUsers();

  if (!user) {
    // Handle case where user data is not available
    return <div> User data not found! </div>; 
  }

  console.log(user);

  const logout = () => {
    window.open("http://localhost:5000/api/auth/logout", "_self");
    localStorage.removeItem("token");
  };

  return (
    <div className="dropdown-menu">
      <ul className="dropdownMenuul" style={{backgroundColor:"transparent", border:"none",boxShadow:"none"}}>
        <Link style={{ textDecoration: "none" }} to="#" onClick={logout}>
          <li className="dropdownMenuli" style={{backgroundColor:"black", color:"white"}}>Log Out</li>
        </Link>
      </ul>
    </div>
  );
};

export default DropdownMenu;