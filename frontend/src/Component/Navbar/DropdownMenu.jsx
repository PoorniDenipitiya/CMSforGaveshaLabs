
import React from "react";
import { Link } from "react-router-dom";
import "./DropdownMenu.css";
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
      <ul className="dropdownMenuul">
        <div className="dropDownProfileImg">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="dropDownProfileImg"
          />
        </div>
        <div className="ProfileHeaderText">
          {user.username}
          <button className="DropdownEditProfile">
            <Link
              style={{ textDecoration: "none" }}
              to="/EditProfile"
              className="editprofiledropdown"
            >
              Edit Profile
            </Link>
          </button>
        </div>

        <Link style={{ textDecoration: "none" }} to="/MySaves">
          <li className="dropdownMenuli">My Bookmarks</li>
        </Link>

        <Link style={{ textDecoration: "none" }} to="/MyCollections">
          <li className="dropdownMenuli">My Collections</li>
        </Link>

        <Link style={{ textDecoration: "none" }} to="/MyQuestions">
          <li className="dropdownMenuli">My Questions</li>
        </Link>

        <Link style={{ textDecoration: "none" }} to="#" onClick={logout}>
          <li className="dropdownMenuli">Log Out</li>
        </Link>
      </ul>
    </div>
  );
};

export default DropdownMenu;
