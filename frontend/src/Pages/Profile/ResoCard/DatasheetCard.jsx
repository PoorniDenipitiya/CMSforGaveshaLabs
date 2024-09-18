
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../Resources/Sensors/Sensors.css";
import { MdDelete } from "react-icons/md";

const DatasheetCard = ({ resoPost, onDelete }) => {
  const [author, setAuthor] = useState(null);

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

  const handleDeletePost = async () => {
    const confirmation = window.confirm("Are you sure you want to delete the post?");
    if (confirmation) {
      onDelete(resoPost._id);
    }
  };

  return (
    <div className="datasheet-card" s>
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

    <div className="datafooter">   
      <div className="data-delete-wrapper">
            <MdDelete className="data-delete-icon" onClick={handleDeletePost} />
      </div>
      <div className="datapost-status">
        {resoPost.approved && !resoPost.rejected && <p>Status: Approved</p>}
        {!resoPost.approved && resoPost.rejected && <p>Status: Rejected</p>}
        {!resoPost.approved && !resoPost.rejected && <p>Status: Pending</p>}
      </div>
    </div> 

    </div>
  );
};

DatasheetCard.propTypes = {
  resoPost: PropTypes.shape({
    postedBy: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    pdf: PropTypes.string,
  }).isRequired,
};

export default DatasheetCard;
