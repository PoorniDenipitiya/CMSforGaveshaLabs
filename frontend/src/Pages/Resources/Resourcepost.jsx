
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ResoPostdetails.css";
import ReactQuill from "react-quill"; // Import ReactQuill for rendering
import axios from "axios";
import { useUsers } from "../../Context/UserContext";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import Notification from '../Blogs/BlogNotification';
import { FaStar } from "react-icons/fa";
import Alert from "../../Component/Alert/Alert";
const Resourcepost = ({ resoPost }) => {
  const [author, setAuthor] = useState(null);
  const { user } = useUsers();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const averageRating = resoPost.ratings && resoPost.ratings.length > 0
    ? resoPost.ratings.reduce((acc, r) => acc + r.rating, 0) / resoPost.ratings.length
    : 0;

    console.log(averageRating);

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
        const userData = await fetchUserData(resoPost.postedBy);
        setAuthor(userData); // Set author data
        console.log(userData);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
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
      setShowAlert(true);
  }};
  const handleAlertClose = () => {
    setShowAlert(false);
    navigate('/login');
  };
  return (
    <div className="res-post">
      <div>
      <Link to={`/resopostdetails/${resoPost._id}`}>
        <div className="respostimg">
          <img src={resoPost.photo} alt={resoPost.title} className="res-post-img" />
        </div>
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
        <div className="respostcontent">
          <h3>{resoPost.title}</h3>
          {resoPost.desc ? (
            <ReactQuill value={resoPost.desc.slice(0, 200) + "...Read more"} readOnly={true} theme="bubble" />
          ) : (
            <p>Description not available</p>
          )}
        </div>

        </Link>
        </div>
        <div className="postfooter">
        <div className="bookmarkWrapper">
            <button className="BlogFooterkButton" onClick={handleBookmark}>
              <CIcon
                icon={icon.cilBookmark}
                size=""
                style={{ color: isBookmarked ? "purple" : "black" }}
                className="BlogFooteMarkIcon"
              />
            </button>
            {showAlert && (
            <Alert
              message="Please login ."
              onClose={handleAlertClose}
            />
          )}
        </div>

        {showNotification && (
          <Notification
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        )}

       

        <div className="res-rating">
        <FaStar className="resoStar" size={20} color="#ffc107" />
        <span>{averageRating.toFixed(1)}</span>
        </div>
 </div>
    </div>
  );
};

export default Resourcepost;
