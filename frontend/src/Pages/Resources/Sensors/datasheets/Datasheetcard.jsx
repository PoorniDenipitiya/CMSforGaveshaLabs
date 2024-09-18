
import React, { useState, useEffect } from "react";
import "../Sensors.css";
import axios from "axios";
import { useUsers } from "../../../../Context/UserContext";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import Notification from '../../../Blogs/BlogNotification';
import { useNavigate } from "react-router-dom";

const Datasheetcard = ({ resoPost }) => {
  const [author, setAuthor] = useState(null);
  const { user } = useUsers();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/details/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await response.json();
        setAuthor(userData); // Set author data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(resoPost.postedBy);
  }, [resoPost.postedBy]);

  useEffect(() => {
    const checkBookmark = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/bookMarks/${user._id}`);
          const bookmarks = response.data;
          const isBookmarked = bookmarks.some(
            (bookmark) => bookmark.resoPost && bookmark.resoPost._id === resoPost._id
          );
          setIsBookmarked(isBookmarked);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      }
    };

    checkBookmark();
  }, [resoPost._id, user]);

  const handleBookmark = async () => {
    if (user) {
      try {
        const response = await axios.post(`http://localhost:5000/api/bookMarks/resobookmark`, {
          userId: user._id,
          resoPostId: resoPost._id,
        });

        setIsBookmarked(response.data.blogPost ? !isBookmarked : isBookmarked);
        setNotificationMessage(isBookmarked ? 'Bookmark removed successfully!' : 'Bookmarked successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        console.log(error);
      }
    } else {
      setTimeout(() => {
        window.alert("Please login to add Bookmarks.");
      }, 100);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };


  return (
    <div className="datasheet-card">
       <div className="resuserdetails">
          {author && (
            <div className="authorInfo">
              <img
                src={author.profilePicture}
                alt={author.username}
                className="authorProfilePicture"
              />
              <p>{author.username}</p> {/* Display author name */}
            </div>
          )}
          <p>{new Date(resoPost.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="datapostcontent">
          <h3>{resoPost.title}</h3>
          {resoPost.pdf && (
          <div className="reso-post-pdf">
            <a
              href={resoPost.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-link"
            >
              View Data Sheet
            </a>
          </div>
        )}
      </div>

      <div className="datapostfooter">
        <div className="bookmarkWrapper">
            <button className="BlogFooterkButton" onClick={handleBookmark}>
              <CIcon
                icon={icon.cilBookmark}
                size=""
                style={{ color: isBookmarked ? "purple" : "black" }}
                className="BlogFooteMarkIcon"
              />
            </button>
        </div>

        {showNotification && (
          <Notification
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        )}

        </div>

    </div>
  );
};


export default Datasheetcard;
