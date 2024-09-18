import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css"; 
import AnimatedHeart from "react-animated-heart";
import axios from "axios";
//import ProjectSeeMore from "./ProjectSeeMore";
import { URL } from "../../url"; // Ensure this is correctly imported
import { useUsers } from "../../Context/UserContext"; // Import user context
import Alert from "../../Component/Alert/Alert";
import { useNavigate } from "react-router-dom"; 

export const ProjectCard = ({ projectpost, page }) => {
  // State to manage the click state and count for each project card for the current session
  const [isClick, setClick] = useState(false);
  const [likes, setLikes] = useState(projectpost.likes || 0);
   const { user } = useUsers(); // Access user data from context
  const [showAlert, setShowAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false); // State for login alert
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
        console.log(userData);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [projectpost.postedBy]);


  useEffect(() => {
    setLikes(projectpost.likes || 0);
  }, [projectpost.likes]);

 /* const handleClick = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/projectposts/${projectpost._id}/like`
      );
      setLikes(res.data.likes);
      setClick(true);
    } catch (err) {
      console.log(err);
    }
  }; */

  const handleLike = async () => {
    if (!user) {
      setShowLoginAlert(true); // Show login alert if user is not logged in
      return;
    }
    if (liked) return; // Prevent multiple likes
    try {
      const response = await axios.post(
        `${URL}/api/projectposts/${projectpost._id}/like`,
        { likes: 1},  // This payload should align with the server logic
        { withCredentials: true }
      );
      setLikes(response.data.likes);
      setLiked(true);
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleAlertCloselogin = () =>{
    setShowLoginAlert(false);
    navigate('/login');
  }
 

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

          {/*  <div className="project_heart">
            <AnimatedHeart
             isClick={isClick}
             onClick={handleClick}
                 />
            <p className="project_heart_line">
            {likes} Likes
            </p>
          </div>*/}
        </div>
        <div className="project_last_line">
          <div className="project_heart">
            <ul>
              <li>
              {/*  <AnimatedHeart isClick={isClick} onClick={handleClick} />{" "} */}
              <AnimatedHeart isClick={liked} onClick={handleLike}  ></AnimatedHeart>

              </li>
              <br></br>
              <li>
                <p className="project_heart_line">{likes} Likes</p>
              </li>
            </ul>
          </div>

          <div className="project_details">
     
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
        {/*    <div className="project_details">
            <p className="project_published_details">
              {new Date(projectpost.updatedAt).toString().slice(0, 15)}
            </p>
            <p className="project_published_details">
              {new Date(projectpost.updatedAt).toString().slice(16, 24)}
            </p>
            <p className="project_published_details">by {projectpost.name}</p>
          </div>*/}
           {showLoginAlert && (
        <Alert
          message="Please log in "
          onClose={handleAlertCloselogin}
        />
      )}
      </div>
    </div>
  );
};

export default ProjectCard;