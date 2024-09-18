import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { URL } from "../../url";
import "./ProjectHome.css"; 
import ProjectCard from "./ProjectCard";
import ProjectPgNavi from "./ProjectPgNavi";
import { useNavigate,useLocation } from "react-router-dom";
//import { BrowserRouter as Router, Route } from "react-router-dom";
//import ProjectViewAll from "./ProjectViewAll";
import banner2 from "./Assets/banner2.png";
import downarrow from "./Assets/downarrow.gif";
import searchIcon from '../../Component/Assets/search.png';
import { useUsers } from "../../Context/UserContext"; // Import user context
import Alert from "../../Component/Alert/Alert";


//scroll
import AOS from "aos";
import "aos/dist/aos.css";

export const Projects = ({ defaultValue = "" }) => {
  const [projectposts, setProjectposts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4); //number of posts to display per page.
  const [orderBy, setOrderBy] = useState("latest"); // Default order by latest
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUsers(); // Access user data from context
const [showAlert, setShowAlert] = useState(false);
const [prompt, setPrompt] = useState(defaultValue); // State variable to hold the search query

  useEffect(() => {  
    setPrompt(defaultValue); // Set the default value when it changes
  }, [defaultValue]);

  const handleSearch = () => {
    if (prompt) {
      navigate(`/projectsearch?query=${prompt}`);
    } else {
      navigate("/project");
    }
  };


  //scroll
  useEffect(() => {
    AOS.refresh(); // Refresh AOS on component mount/update
  }, []);

  //fetching approved data
  const fetchProjectposts = async (order) => {
    try {
      const res = await axios.get(URL + "/api/projectposts/"); 
      const approvedProjectposts = res.data.filter(
        (projectpost) => projectpost.approved
      );
      // Sort the approved projects by updatedAt date
      const sortedProjectposts = approvedProjectposts.sort((a, b) => {
        if (order === "latest") {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        } else {
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        }
      });
      setProjectposts(sortedProjectposts);
    } catch (err) {
      console.log(err);
    }
  };

  //to see the posts
  useEffect(() => {
    fetchProjectposts(orderBy);
  }, [orderBy]);

  // Fetch posts
  /*   useEffect(() => {
    axios
      .get("/api/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts: ", error);
      });
  }, []);*/

  // Get current posts based on order
  const currentPosts = projectposts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle ordering change
  const handleOrderByChange = (e) => {
    setOrderBy(e.target.value);
    setCurrentPage(1); // Reset to first page when changing order
  };

  const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return !!localStorage.getItem("token"); // Example using token stored in localStorage
  };

 {/* const handlePostProject = () => {
    if (isAuthenticated()) {
      navigate("/projectform"); // Redirect to post project page
    } else {
      navigate("/signup"); // Redirect to signup page
    }
  }; */}
 
  const handleCreateClick = () => {
    if (!user) {
      setShowAlert(true);
    } else {
      navigate('/projectform');
    }
  };

  const handleAlertClose = () => {
    const scrollPosition = window.scrollY;

    setShowAlert(false);
    navigate('/login', { state: {  from: location, scrollPosition } });
  };

  const scrollToContent = () => {
    const content = document.getElementById("project_orderBy");
      if (content) {
      const scrollOffset = content.getBoundingClientRect().height * 1.75; // Adjust the scroll offset as needed
     window.scrollBy({ top: scrollOffset, behavior: "smooth" });
    } 
  };

  //banner
 {/* const scrollToContent = () => {
    if (shopBannerRef.current) {
      const offsetTop =
        shopBannerRef.current.getBoundingClientRect().top + window.scrollY;
      const additionalOffset = 300; // Adjust this value to scroll more
      window.scrollTo({
        top: offsetTop + additionalOffset,
        behavior: "smooth",
      });
    } else {
      console.log("Element 'shopbanner' ref not found.");
    }
  };*/}

  return (
    <div data-aos="fade-up">
      {" "}
      {/*scroll */}
      <div class="project_banner">
        
        <div className="project_bannerimg">
          <img src={banner2} alt="image" />
        </div> 
        <div className="prosearch">
        <input
            type="text"
            className="searchproBar" // CSS class for the search bar input
            placeholder="Search for more.." // Placeholder text for the search bar
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            // Function to update the search query state on input change
          />
          <img
            src={searchIcon} // Source of the search icon image
            className="searchproIcon" // CSS class for the search icon
            onClick={handleSearch} // Function to navigate based on the search query
            alt="Search Icon" // Alt text for the search icon image
          /></div>
        <div class="project_bannertext">
          
          Unleash Innovation<br></br>
          <p className="project_bannertextline">
            Explore Cutting-Edge Electronics Projects!
          </p>
        </div>

        <div class="project_bannerarrow">
          <button onClick={scrollToContent}>
            {downarrow && (
              <img
                src={downarrow}
                alt="downarrow"
                className="project_button-icon"
              />
            )}
          </button>
        </div>
      </div>
      {/*    <button onClick={scrollToContent}>
              {read && (
                  <img src={read} alt="read" className="button-icon" />
                )} Learn
              </button>*/}
              <br></br>
      <div className="project_orderBy" id="project_orderBy">
        <label htmlFor="orderBy">Order By:</label>
        <select id="pro_orderBy" value={orderBy} onChange={handleOrderByChange}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="project_grid" id="project_grid">
        {currentPosts.map((projectpost) => (
          <ProjectCard key={projectpost._id} projectpost={projectpost} />
        ))}
      </div>
      <ProjectPgNavi
        postsPerPage={postsPerPage}
        totalPosts={projectposts.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <hr className="project_line"></hr>
      <div className="project_box">
        <p id="para">
          If you are like to share your properly finished project <br /> among
          other electronic hobbists as you, <br /> This place is yours!
        </p>
        {/* <Link to="/projectform" rel="noopener noreferrer">*/}
        <button className="projectclick_button" onClick={handleCreateClick}>
          Post Your Project Here!
        </button> 
        {showAlert && (
            <Alert
              message="Please login to create a project post."
              onClose={handleAlertClose}
              
            />
          )}
        {/*  </Link>*/}
      </div>
    </div>
  );
};

export default Projects;
