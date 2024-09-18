import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUsers } from "../../Context/UserContext";
import Blogspost from "../Blogs/Blogspost";
import Resopost from "../Resources/Resourcepost";
import Datasheet from "../Resources/Sensors/datasheets/Datasheetcard";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import "./MySaves.css";
import "../Resources/Sensors/Sensors.css";
import "../Blogs/Blog.css";
import bookMarkBanner from "./Assets/bookMarkBanner.jpg";

const MySaves = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [resoPosts, setResoPosts] = useState([]);
  const [showGrid, setShowGrid] = useState(false); // State to track whether to show grid view
  const [showResoGrid, setShowResoGrid] = useState(false);
  const { user } = useUsers();

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `http://localhost:5000/api/bookMarks/${user._id}`
          );
          
          const fetchedBlogPosts = response.data
            .filter(item => item.blogPost) // Ensure blogPost is defined
            .map(item => item.blogPost);
          setBlogPosts(fetchedBlogPosts);

          const fetchedResoPosts = response.data
            .filter(item => item.resoPost) // Ensure resoPost is defined
            .map(item => item.resoPost);
          setResoPosts(fetchedResoPosts);
        }
      } catch (error) {
        console.error("Error fetching bookmarked posts:", error);
      }
    };

    fetchBookmarkedPosts();
  }, [user]);

  const handleToggleGrid = () => {
    setShowGrid(!showGrid); // Toggle the state when dropdown button is clicked
  };

  const handleToggleResoGrid = () => {
    setShowResoGrid(!showResoGrid);
  };

  return (
    <div className="mySavesBody">
      <div className="BookMarkBanner">
        <img src={bookMarkBanner} alt="" className="BookMarkBannerImage" />
        <div className="BookMarkBannerText">Your Book Marks</div>
      </div>

      <div className="mySaveBookMarksDiv">
        <div className="mySaveBookMarksSubDiv">
          <div className="mySaveTags">
            Blogs <hr />
            <button onClick={handleToggleGrid} className="toggleButton">
              {showGrid ? (
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
          <p className="UserBlogsCount">
            No of Blogs: {blogPosts.length}
          </p>
        </div>
        <div className="blogCardMyBookMarks">
          {blogPosts.length === 0 ? (
            <p>No saved blog posts found.</p>
          ) : (
            <ul>
              {/* Conditionally render the first three blog posts or all blog posts */}
              {showGrid
                ? blogPosts.map((blogPost) => (
                    <Blogspost
                      style={{ textDecoration: "none" }}
                      key={blogPost._id}
                      blogPost={blogPost}
                    />
                  ))
                : blogPosts
                    .slice(0, 3)
                    .map((blogPost) => (
                      <Blogspost
                        style={{ textDecoration: "none" }}
                        key={blogPost._id}
                        blogPost={blogPost}
                      />
                    ))}
            </ul>
          )}
        </div>

        <div
      className="mySaveBookMarksresoDiv"
      style={{
        width: '3200px',
        overflowX: 'hidden',
        marginTop: '15px',
      }}
    >
      <div className="mySaveBookMarksresoSubDiv">
        <div className="mySaveTags" style={{ display: 'flex', alignItems: 'center', fontSize: '24px', marginLeft: '80px' }}>
          Resources
          {"   "}
          <button
            onClick={handleToggleResoGrid}
            className="toggleButton"
            style={{
              backgroundColor: '#fff',
              border: 'none',
              marginLeft: 'auto',
              marginRight: '50px',
            }}
          >
            {showResoGrid ? (
              <CIcon
                icon={icon.cilCaretTop}
                size=""
                style={{ "--ci-primary-color": "black", width: '20px' }}
                className="dropdownIcon"
              />
            ) : (
              <CIcon
                icon={icon.cilCaretBottom}
                size=""
                style={{ "--ci-primary-color": "black", width: '20px' }}
                className="dropdownIcon"
              />
            )}
          </button>
        </div>
        <p className="UserCount" style={{ fontSize: '16px', marginBottom: '5px', marginLeft: '80px' }}>
          {" "}
          No of Resources: {"   "} {resoPosts.length}{" "}
        </p>
      </div>

      <div>
      {resoPosts.length === 0 ? (
        <p>No saved resource posts found.</p>
      ) : (
        <ul
          style={{
            marginLeft: '100px',
            display: 'flex',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gridGap: '5px',
            marginTop: '35px',
          }}
        >
          {resoPosts.length > 0 ? (
            resoPosts.map((post) => {
              if (post.photo && post.desc) {
                return (
                  <Resopost key={post._id} resoPost={post} />
                );
              } else if (post.pdf) {
                return <Datasheet key={post._id} resoPost={post} />;
              } else {
                return <p key={post._id}>Unknown post type</p>;
              }
            })
          ) : (
            <p>No posts available.</p>
          )}
        </ul>
      )}
    </div>
    </div>
      </div>
    </div>
  );
};

export default MySaves;