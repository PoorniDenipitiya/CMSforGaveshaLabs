import React, { useEffect, useState } from "react";
import BlogCard from "./blogCard/blogCard";
import ShopCard from "./shopcard/ShopCard";
import ResoCard from "./ResoCard/ResoCard";
import PostList from "./ResoCard/PostList";
import ProjectCard from "./Projectcard/Projectcard";
import axios from "axios";
import { useUsers } from "../../Context/UserContext";
import "./MySaves.css";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

const MyCollections = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [shoppost, setShopposts] = useState([]);
  const [resoPosts, setResoPosts] = useState([]);
  const [projectPosts, setProjectPosts] = useState([]);
  const [showBlogGrid, setShowBlogGrid] = useState(false);
  const [showShopGrid, setShowShopGrid] = useState(false);
  const [showResoGrid, setShowResoGrid] = useState(false);
  const [showProGrid, setShowProGrid] = useState(false);

  const { user } = useUsers();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/blogPosts/user/${user._id}`
        );
        setBlogPosts(res.data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      }
    };
    if (user) {
      fetchBlogPosts();
    }
  }, [user]);


  useEffect(() => {
    const fetchShopPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/Shoppost/user/${user._id}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setShopposts(data); // Update shopPosts state with fetched data
      } catch (err) {
        console.error('Error fetching shop posts:', err);
      }
    };

    if (user && user._id) {
      fetchShopPosts();
    }
  }, [user]);

  useEffect(() => {
    const fetchResoPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/resoposts/user/${user._id}`
        );
        setResoPosts(res.data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      }
    };
    if (user) {
      fetchResoPosts();
    }
  }, [user]);

  useEffect(() => {
    const fetchProjectPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projectposts/user/${user._id}`
        );
        setProjectPosts(res.data);
      } catch (err) {
        console.error("Error fetching project posts:", err);
      }
    };
    if (user) {
      fetchProjectPosts();
    }
  }, [user]);

  const handleBlogDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogPosts/${postId}`);
      setBlogPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting blog post:", err);
    }
  };

  const handleShopDelete = async (shoppostId) => {
    try {
      await axios.delete(`http://localhost:5000/api/Shoppost/${shoppostId}`);
      setShopposts((prevShopposts) => prevShopposts.filter((shoppost) => shoppost._id !== shoppostId));
      console.log("Shop post deleted:", shoppostId);
    } catch (err) {
      console.error("Error deleting shop post:", err);
    }
  };


  const handleResoDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/resoposts/${postId}`);
      setResoPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting blog post:", err);
    }
  };

  const handleProjectDelete = async (projectpostId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projectposts/${projectpostId}`);
      setProjectPosts((prevPosts) => prevPosts.filter((projectpost) => projectpost._id !== projectpostId));
    } catch (err) {
      console.error("Error deleting project post:", err);
    }
  };


  if (!user) {
    return <div>User data not found!</div>;
  }

  const handleToggleBlogGrid = () => {
    setShowBlogGrid(!showBlogGrid);
  };

  const handleToggleShopGrid = () => {
    setShowShopGrid(!showShopGrid);
  };

  const handleToggleResoGrid = () => {
    setShowResoGrid(!showResoGrid);
  };

  const handleToggleProjectGrid = () => {
    setShowProGrid(!showProGrid);
  };

  return (
    <div className="mySavesBody">

      <div className="UserDetailsDiv">
        <div className="UserInfo">
          {user && (
            <>
              <p className="UserName">{user.username}</p>
              <p className="UserEmail">Email: {user.email}</p>
            </>
          )}
        </div>
        <div className="UserProfilePicture">
          {user && (
            <img
              src={user.profilePicture}
              alt={`${user.username}`}
              className="UserImage"
            />
          )}
        </div>
      </div>

      <hr />
      <div className="mySaveBookMarksresoDiv">
        <div className="mySaveBookMarksresoSubDiv">
          <div className="mySaveTags">
            Resources
            {"   "}
            <button onClick={handleToggleResoGrid} className="toggleButton">
              {showResoGrid ? (
                <CIcon
                  icon={icon.cilCaretTop}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              ) : (
                <CIcon
                  icon={icon.cilCaretBottom}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              )}
            </button>
          </div>
          <p className="UserCount">
            {" "}
            No of Resources: {"   "} {resoPosts.length}{" "}
          </p>
        </div>

        {resoPosts.length === 0 ? (
          <p>No saved resource posts found.</p>
        ) : (
          <ul>
            <PostList posts={showResoGrid ? resoPosts : resoPosts.slice(0, 3)} onDelete={handleResoDelete} />
          </ul>
        )}
      </div>

      <hr />



      <div className="mySaveBookMarksproDiv">
        <div className="mySaveBookMarksproSubDiv">
          <div className="mySaveTags">
            Projects
            {"   "}
            <button onClick={handleToggleProjectGrid} className="toggleButton">
              {showProGrid ? (
                <CIcon
                  icon={icon.cilCaretTop}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              ) : (
                <CIcon
                  icon={icon.cilCaretBottom}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              )}
            </button>
          </div>
          <p className="UserCount">
            {" "}
            No of Projects: {"   "} {projectPosts.length}{" "}
          </p>
        </div>

        {projectPosts.length === 0 ? (
          <p>No saved projects found.</p>
        ) : (
          <ul>
            {showProGrid
              ? projectPosts.map((projectpost) => (
                <ProjectCard
                  style={{ textDecoration: "none" }}
                  key={projectpost._id}
                  projectpost={projectpost}
                  onDelete={handleProjectDelete}
                />
              ))
              : projectPosts.slice(0, 3).map((projectpost) => (
                <ProjectCard
                  style={{ textDecoration: "none" }}
                  key={projectpost._id}
                  projectpost={projectpost}
                  onDelete={handleProjectDelete}
                />
              ))}
          </ul>
        )}
      </div>

      <hr />
      <div className="mySaveBookMarksDiv">
        <div className="mySaveBookMarksSubDiv">
          <div className="mySaveTags">
            Blogs
            {"   "}
            <button onClick={handleToggleBlogGrid} className="toggleButton">
              {showBlogGrid ? (
                <CIcon
                  icon={icon.cilCaretTop}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              ) : (
                <CIcon
                  icon={icon.cilCaretBottom}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              )}
            </button>
          </div>
          <p className="UserCount">
            {" "}
            No of Blogs: {"   "} {blogPosts.length}{" "}
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <p>No saved blog posts found.</p>
        ) : (
          <ul>
            {showBlogGrid
              ? blogPosts.map((blogPost) => (
                <BlogCard
                  style={{ textDecoration: "none" }}
                  key={blogPost._id}
                  blogPost={blogPost}
                  onDelete={handleBlogDelete}
                />
              ))
              : blogPosts.slice(0, 3).map((blogPost) => (
                <BlogCard
                  style={{ textDecoration: "none" }}
                  key={blogPost._id}
                  blogPost={blogPost}
                  onDelete={handleBlogDelete}
                />
              ))}
          </ul>
        )}

      </div>

      <hr />

      <div className="mySaveBookMarksshopDiv">
        <div className="mySaveBookMarksshopSubDiv">
          <div className="mySaveTags">
            Advertisements
            {"   "}
            <button onClick={handleToggleShopGrid} className="toggleButton">
              {showShopGrid ? (
                <CIcon
                  icon={icon.cilCaretTop}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              ) : (
                <CIcon
                  icon={icon.cilCaretBottom}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdownIcon"
                />
              )}
            </button>
          </div>
          <p className="UserCount">
            {" "}
            No of Ads: {"   "} {shoppost.length}{" "}
          </p>
        </div>
        {shoppost.length === 0 ? (
          <p>No saved Advertisements found.</p>
        ) : (
          <ul>
            {showShopGrid
              ? shoppost.map((shoppost) => (
                <ShopCard
                  style={{ textDecoration: "none" }}
                  key={shoppost._id}
                  shoppost={shoppost}
                  onDelete={handleShopDelete}
                />
              ))
              : shoppost.slice(0, 4).map((shoppost) => (
                <ShopCard
                  style={{ textDecoration: "none" }}
                  key={shoppost._id}
                  shoppost={shoppost}
                  onDelete={handleShopDelete}
                />
              ))}
          </ul>
        )}


      </div>





    </div>




  );
};

export default MyCollections;