
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import { MdDelete } from "react-icons/md";
import "../../Resources/Sensors/Sensors.css";
import { FaStar } from "react-icons/fa";
import Alert from "../../../Component/Alert/Alert"; // Import Alert component
const ResoCard = ({ resoPost, onDelete }) => {
  const [author, setAuthor] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const averageRating = resoPost.ratings && resoPost.ratings.length > 0
    ? resoPost.ratings.reduce((acc, r) => acc + r.rating, 0) / resoPost.ratings.length
    : 0;

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/details/${userId}`);
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
        setAuthor(userData);
        console.log(userData);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [resoPost.postedBy]);

  const handleDelete = () => {
    setShowDeleteAlert(true);
  };
  

  const handleAlertClose = () => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(resoPost._id);
    }
    setShowDeleteAlert(false);
  };

  return (
    <div className="res-post">
      <Link to={`/resopostdetails/${resoPost._id}`}>
        {resoPost.photo && (
          <div className="respostimg">
            <img src={resoPost.photo} alt={resoPost.title} className="res-post-img" />
          </div>
        )}
        <div className="resuserdetails">
          {author && (
            <div className="authorInfo">
              <img
                src={author.profilePicture}
                alt={author.username}
                className="authorProfilePicture"
              />
              <p>{author.username}</p>
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
      <div className="post-status">
        {resoPost.approved && !resoPost.rejected && <p>Status: Approved</p>}
        {!resoPost.approved && resoPost.rejected && <p>Status: Rejected</p>}
        {!resoPost.approved && !resoPost.rejected && <p>Status: Pending</p>}
      </div>
      <div className="postfooter">
        <div className="reso-edit-delete-wrapper">
          <MdDelete className="reso-delete-icon" onClick={handleDelete} />
        </div>
        <div className="res-rating">
          <FaStar className="resoStar" size={20} color="#ffc107" />
          <span>{averageRating.toFixed(1)}</span>
        </div>
        {showDeleteAlert && (
        <Alert
          message="Are you sure you want to delete this post?"
          onClose={handleAlertClose}
          
        />
      )}
      </div>
    </div>
  );
};

export default ResoCard;
