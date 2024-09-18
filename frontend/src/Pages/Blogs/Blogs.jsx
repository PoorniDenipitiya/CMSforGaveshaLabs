import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Blogspost from "./Blogspost";
import PopularBlogpost from "./PopularBlogpost";
import axios from "axios";
import { useUsers } from "../../Context/UserContext"; // Import user context
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Alert from "../../Component/Alert/Alert";
import searchIcon from '../../Component/Assets/search.png'; 
// import { SearchResults} from "../Resources/Sensors/SearchResults"

// Pagination component for rendering pagination controls
const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  // Calculating the total number of pages
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    // Pagination navigation
    <nav>
      <ul className="pagination">
        {/* Rendering pagination links */}
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            {/* Handling pagination click */}
            <a onClick={() => paginate(number)} className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Main Blogs component
export const Blogs = ({ defaultValue = "" }) => {
  const [blogPost, setPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeFilter, setActiveFilter] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const { user } = useUsers(); // Access user data from context
  const navigate = useNavigate(); // Use useNavigate hook
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [prompt, setPrompt] = useState(defaultValue); // State variable to hold the search query
  
  useEffect(() => {  
    setPrompt(defaultValue); // Set the default value when it changes
  }, [defaultValue]);

  const handleSearch = () => {
    if (prompt) {
      navigate(`/blogsearch?query=${prompt}`);
    } else {
      navigate("/blogs");
    }
  };
  useEffect(() => {
    // Restore scroll position upon navigating back from login
    if (location.state?.scrollPosition) {
      window.scrollTo(0, location.state.scrollPosition);
    }
  }, [location.state?.scrollPosition]);

  // Function to sort posts based on order
  const sortPosts = async (order) => {
    try {
      let sortedPosts = [...blogPost];
      // Sorting logic based on order
      if (order === "asc") {
        sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
      } else if (order === "desc") {
        sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
      }  else if (order === "latest") {
        sortedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      setPost(sortedPosts);
      setSortOrder(order);
      setActiveFilter(order);
    } catch (err) {
      console.error("Error sorting blog posts:", err);
    }
  };

  // Function to fetch blog posts from the server
  const fetchBlogPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/blogPosts?sort=${sortOrder}`
      );
      const sortedBlogs = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPost(sortedBlogs);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
    }
  };

  // Function to fetch top 3 popular blog posts from the server
  const fetchTopPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogPosts/popularBlogs");
      setTopPosts(res.data);
    } catch (err) {
      console.error("Error fetching top posts:", err);
    }
  };

  // Fetching blog posts on component mount
  useEffect(() => {
    const fetchAndSortPosts = async () => {
      sortPosts("latest");
      fetchBlogPosts("latest");
      fetchTopPosts();
    };

    fetchAndSortPosts();
  }, []);

  // Calculating indexes of first and last posts for current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPost.slice(indexOfFirstPost, indexOfLastPost);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle create button click
  const handleCreateClick = () => {
    if (!user) {
      setShowAlert(true);
    } else {
      navigate('/writeBlog'); 
    }
  };
  const handleAlertClose = () => {
    const scrollPosition = window.scrollY;
    setShowAlert(false);
    navigate("/login", { state: {  from: location, scrollPosition } });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  // Rendering the component
  return (
    <div className={`blogHome`}>
      {/* Banner section */}
      <div className="blogBanner">
        <div className="bannerSection">
          <p className="blogQuote">
            {" "}
            Join the community, Explore, Learn, Create - Your hub for all things
            electronic, empowering every step of your IoT journey with Trivia,
            and share your own insights with just a click!!{" "}
          </p>
          <br />
          {/* Link to create a new blog */}
          <div className="Bannercreate">
            <button onClick={handleCreateClick} className="createLink">
              {" "}
              Create{" "}
            </button>
            {showAlert && (
            <Alert
              message="Please Login to create a Blog Post."
              onClose={handleAlertClose}
            />
          )}
          </div>

        </div>
        <div
  className="BlogSearchDiv"
  style={{
    position: 'absolute',
    display: 'flex',
    top: '7%',
    left: '75%',
    height: '30px',
    width: '300px',
    border: 'none',
    backgroundColor: 'white',
    color: '#000',
    fontSize: '13px',
    fontFamily: 'cursive',
    paddingLeft: '20px',
    margin: '0',
    borderRadius:'5px'
  }}
>
  <input
    type="text"
    className="searchBar"
    placeholder="Search for more.."
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    style={{
      height: '30px',
      width: '300px',
      border: 'none',
      backgroundColor: 'white',
      color: '#000',
      fontSize: '13px',
      fontFamily: 'cursive',
      paddingLeft: '20px',
      margin: '0',
    }}
  />
  <img
    src={searchIcon}
    className="searchIcon"
    onClick={handleSearch} 
    alt="Search Icon"
    style={{
      height: '20px',
      width: '30px',
      backgroundColor: 'transparent',
      marginTop: '20px',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    }}
  />
</div>
      </div>

      <p className="PopularBlogsTopic"> Our Most Popular Blogs </p>
      <Slider {...settings}>
        {topPosts.map((post) => (
          <div key={post._id}>
            <PopularBlogpost blogPost={post} />
          </div>
        ))}
      </Slider>


      {/* Blog filters section */}
      <div className="blogFilters">
        {/* Filter buttons */}

        <button
          className={`filterButton ${
            activeFilter === "latest" ? "activeFilterButton" : ""
          }`}
          onClick={() => sortPosts("latest")}
        >
          Latest
        </button>

        <button
          className={`filterButton ${
            activeFilter === "asc" ? "activeFilterButton" : ""
          }`}
          onClick={() => sortPosts("asc")}
        >
          A-Z
        </button>

        <button
          className={`filterButton ${
            activeFilter === "desc" ? "activeFilterButton" : ""
          }`}
          onClick={() => sortPosts("desc")}
        >
          Z-A
        </button>
      </div>

      {/* Blog posts section */}
      <div className="bpost">
        {/* Rendering current posts */}
        {currentPosts.map((blogPost) => (
          <Blogspost
            style={{ textDecoration: "none" }}
            key={blogPost._id}
            blogPost={blogPost}
          />
        ))}
      </div>

      {/* Pagination component */}
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={blogPost.length}
        paginate={paginate}
      />

      

    </div>
  );
};

export default Blogs; // Exporting default component