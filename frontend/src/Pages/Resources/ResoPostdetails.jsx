import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../url";
import { useParams } from "react-router-dom";
import { useUsers } from "../../Context/UserContext";
import "./ResoPostdetails.css";
import { ResoComment } from "./ResoComment";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill"; // Import ReactQuill for rendering
import { FaStar } from "react-icons/fa"; // Import star icon from react-icons
import Alert from "../../Component/Alert/Alert";

export const ResoPostdetails = () => {
  const [author, setAuthor] = useState(null);
  const { user } = useUsers();

  const { id: resoPostId } = useParams();
  const navigate = useNavigate();

  const [resoPost, setResoPost] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(null);

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
      if (resoPost && resoPost.postedBy) {
        try {
          const userData = await fetchUserData(resoPost.postedBy);
          setAuthor(userData);
        } catch (error) {
          console.error("Error fetching author:", error);
        }
      }
    };
    fetchAuthor();
  }, [resoPost]);

  const fetchResoPost = async () => {
    try {
      const res = await axios.get(`${URL}/api/resoposts/${resoPostId}`);
      setResoPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserRating = async () => {
    if (user) {
      try {
        const res = await axios.get(`${URL}/api/resoposts/${resoPostId}/user-rating/${user._id}`);
        setUserRating(res.data ? res.data.rating : 0);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchPostComments = async () => {
    try {
      const res = await axios.get(`${URL}/api/resocomments/post/${resoPostId}`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResoPost();
    fetchPostComments();
    fetchUserRating();
  }, [resoPostId, user]);

  const postComment = async () => {
    if (user) {
      try {
        await axios.post(
          `${URL}/api/resocomments/create`,
          { comment, postId: resoPostId, postedBy: user._id },
          { withCredentials: true }
        );
        fetchPostComments();
        setComment("");
      } catch (err) {
        console.log(err);
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleRating = async (rate) => {
    if (user) {
      try {
        await axios.post(`${URL}/api/resoposts/${resoPostId}/rate`, { userId: user._id, rating: rate }, { withCredentials: true });
        setUserRating(rate);
        fetchResoPost(); // Update the post details to reflect the new rating
      } catch (err) {
        console.log(err);
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate('/login');
  };

  return (
    <div className="reso-post-details-container">
      <div className="reso-post-title-wrapper">
        <h1 className="reso-post-title">{resoPost.title}</h1>
      </div>
      <div className="reso-post-info">
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
        <p>{new Date(resoPost.createdAt).toString().slice(0, 15)}</p>
      </div>
      <img src={resoPost.photo} alt="" className="reso-post-image" />
      <div className="reso-post-content">
        <ReactQuill value={resoPost.desc} readOnly={true} theme="bubble" />
      </div>
      <div className="reso-post-categories">
        <p>Categories:</p>
        <div>
          {resoPost.categories?.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
      </div>
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <FaStar
              key={index}
              size={30}
              onClick={() => handleRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
              color={ratingValue <= (hover || userRating) ? "#ffc107" : "#e4e5e9"}
              style={{ cursor: "pointer", transition: "color 200ms" }}
            />
          );
        })}
        {showAlert && (
          <Alert
            message="Please login ."
            onClose={handleAlertClose}
          />
        )}
        <p>Your Rating: {userRating}</p>
      </div>
      <div className="reso-comments-section">
        <h3>Comments:</h3>
        <div className="reso-write-comment">
          <input
            onChange={(e) => setComment(e.target.value)}
            type="text"
            value={comment}
            placeholder="Write a comment"
            className="resocomsection"
          />
          <button onClick={postComment}>Add Comment</button>
        </div>
        {comments.map((c) => (
          <ResoComment
            key={c._id}
            c={c}
            fetchPostComments={fetchPostComments}
          />
        ))}
      </div>
    </div>
  );
};
