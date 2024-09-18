import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Projectcard.css";
import { MdDelete } from "react-icons/md";

import axios from "axios";
//import ProjectSeeMore from "./ProjectSeeMore";
import { URL } from "../../../url"; // Ensure this is correctly imported
import { useUsers } from "../../../Context/UserContext"; // Import user context
import Alert from "../../../Component/Alert/Alert";
import { useNavigate } from "react-router-dom"; 

export const ProjectCard = ({ projectpost, page, onDelete }) => {
  // State to manage the click state and count for each project card for the current session
  const [isClick, setClick] = useState(false);
  const [likes, setLikes] = useState(projectpost.likes || 0);
   const { user } = useUsers(); // Access user data from context
   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const navigate = useNavigate(); 
  const [liked, setLiked] = useState(false);
  const [author, setAuthor] = useState(null);

  
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/details/${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await fetchUserData(projectpost.postedBy);
        setAuthor(userData); // Set author data
        
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [projectpost.postedBy]);


  useEffect(() => {
    setLikes(projectpost.likes || 0);
  }, [projectpost.likes]);

  const handleDelete = () => {
    setShowDeleteAlert(true);
  };
  

  const handleAlertClose = () => {
    
      onDelete(projectpost._id);
   
    setShowDeleteAlert(false);
  };



  
  
 

  return (
    <div className="project_inline_cards">
      <div className="project_card">
        <img
          className="project_card_image"
          src={projectpost.project_photo}
          alt="Avatar"
        />

        <div className="project_container">
          <div className="project_container_text">
            <p className="project_card_title">{projectpost.project_name}</p>
            <p className="project_description">{projectpost.intro}</p>

            <div>
              <Link
                to={`/projectseemore/${projectpost._id}`}
              /*  target="_blank"*/
                rel="noopener noreferrer"
              >
                <button className="project_card__btn">Explore</button>
              </Link>
              
            </div>
          </div>
          <div className="post-status" style={{textAlign:'left'}} >
        {projectpost.approved && !projectpost.rejected && <p>Status: Approved</p>}
        {!projectpost.approved && projectpost.rejected && <p>Status: Rejected</p>}
        {!projectpost.approved && !projectpost.rejected && <p>Status: Pending</p>}
      </div>
      <div className="pro-edit-delete-wrapper" style={{cursor:'pointer'}}>
          <MdDelete className="pro-delete-icon" onClick={handleDelete} />
        </div>
        {showDeleteAlert && (
        <Alert
          message="Are you sure you want to delete this post?"
          onClose={handleAlertClose}
          
        />
      )}

          
        </div>
        <div className="project_last_line">
          <div className="project_heart">
            <ul>
              
              <li>
                <p className="project_heart_line" style={{marginTop:'25px'}}>{likes} Likes</p>
              </li>
            </ul>
          </div>

          <div className="project_details" >
     
            <p className="project_published_details">
              {new Date(projectpost.updatedAt).toString().slice(0, 15)}
            </p>
            <p className="project_published_details">
              {new Date(projectpost.updatedAt).toString().slice(16, 24)}
            </p>
            <p className="project_published_details">     {author && (
            <div className="authorInfo">
               <p>{author.username}</p> {/* Display author name */}
             
              <img
                src={author.profilePicture}
                alt={author.username}
                className="authorProfilePicture"
                style={{padding:"2px",marginLeft:"39px", marginTop:"12px" }}
              />
             
            </div>
          )}</p>
          </div>
        </div>
       
           
      </div>
    </div>
  );
};

export default ProjectCard;