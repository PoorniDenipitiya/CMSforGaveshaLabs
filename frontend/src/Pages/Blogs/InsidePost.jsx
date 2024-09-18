import React, { useEffect, useState } from "react";
import "./InsidePost.css";
import axios from "axios";
import { useParams, Link ,useNavigate, useLocation} from "react-router-dom";
import { useUsers } from "../../Context/UserContext";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import { BlogComment } from "./BlogComment";
import Alert from "../../Component/Alert/Alert";
import Notification from './BlogNotification';
const URL = "http://localhost:5000"; // Define your base URL here

const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`${URL}/api/auth/details/${userId}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const InsidePost = () => {
  const { id: blogPostId } = useParams();
  const [blogPost, setBlogPost] = useState({ likes: [] });
    const [author, setAuthor] = useState(null);
  const { user } = useUsers();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [unLiked, setUnLiked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${URL}/api/blogPosts/${blogPostId}`);
      setBlogPost(res.data);
      fetchAuthor(res.data.postedBy);
    } catch (err) {
      console.error("Error fetching blog post:", err);
    }
  };

  const fetchAuthor = async (userId) => {
    try {
      const userData = await fetchUserData(userId);
      setAuthor(userData);
    } catch (error) {
      console.error("Error fetching author:", error);
    }
  };

  const handleLike = async () => {
    if (user) {
      try {
        await axios.post(
          `http://localhost:5000/api/blogPosts/${blogPost._id}/like`,
          { userId: user._id }
        );
        setLikes(likes + 1);
        setLiked(true);
        setUnLiked(false);
        setNotificationMessage('Liked successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

      } catch (error) {
        console.error("Error liking post:", error);
      }
    } else {
      setTimeout(() => {
        const scrollPosition = window.scrollY;
        window.alert("Please login to like the post.");
      }, 100);
      setTimeout(() => {
        const scrollPosition = window.scrollY;
        navigate("/login", { state: { from: location, scrollPosition } });
      }, 2000);
    }
  };


  const handleUnlike = async () => {
    if (user) {
      try {
        await axios.delete(
          `http://localhost:5000/api/blogPosts/${blogPost._id}/like/${user._id}`
        );
        setLikes(likes - 1);
        setLiked(false);
        setUnLiked(true);
        setNotificationMessage('Unliked successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        
      } catch (error) {
        console.error("Error unliking post:", error);
      }
    } else {
      setTimeout(() => {
        const scrollPosition = window.scrollY;
        window.alert("Please login to unlike the post.");
      }, 100);
      setTimeout(() => {
        const scrollPosition = window.scrollY;
        navigate("/login", { state: { from: location, scrollPosition } });
      }, 2000);
    }
  };


  const fetchBlogComments = async () => {
    try {
      const res = await axios.get(`${URL}/api/blogComments/post/${blogPostId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching blog comments:", err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchBlogComments();
  }, [blogPostId]);
  useEffect(() => {
    if (blogPost.likes) {
      setLikes(blogPost.likes.length);
    }
  }, [blogPost]);

  const postComment = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await axios.post(
          `${URL}/api/blogComments/create`,
          { comment, postId: blogPostId, postedBy: user._id },
          { withCredentials: true }
        );
        fetchBlogComments();
        setComment("");
      } catch (err) {
        console.error("Error posting comment:", err);
      }
    } else {
      setShowAlert(true);
    }
  };
  const handleAlertClose = () => {
    const scrollPosition = window.scrollY;
    setShowAlert(false);
    navigate("/login", { state: {  from: location, scrollPosition } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      postComment(e);
    }
  };

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = blogPost.videoURL ? getYoutubeVideoId(blogPost.videoURL) : null;

  return (
    <div className="InsidePost">
      <div className="Blog">
        <h1 className="blogTitle">{blogPost.title}</h1>
        <hr />
        <div className="insideBlogHeader">
          <div className="autherDetails">
            {author && (
              <Link
                style={{ textDecoration: "none" }}
                to={`/authorpage/${author._id}`}
                key={author.id}
              >
                <img
                  src={author.profilePicture}
                  alt=""
                  className="authorProfilePicture"
                />
                <p className="insideBlogAutherName"> {author.username} </p>
              </Link>
            )}
          </div>
          <p className="blogDate">
            Created at: {blogPost.createdAt ? new Date(blogPost.createdAt).toLocaleString() : "Unknown date"}
          </p>
        </div>
        <img src={blogPost.photo} alt="" className="postImage" />
        <p
          className="blogbody"
          dangerouslySetInnerHTML={{ __html: blogPost.desc }}
        />
        {videoId && (
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          </div>
        )}
      </div>

      <div className="insideBlogLikeContainer">
        <span className="insideBlogText">
          Was this Article helpful to you?
        </span>
        <CIcon
          icon={icon.cilThumbUp}
          size=""
          style={{ color: liked ? "purple" : "black" }}
          onClick={handleLike}
          className="insideBlogLike"
        />
        <CIcon
          icon={icon.cilThumbDown}
          size=""
          style={{ color: unLiked ? "purple" : "black" }}     
               onClick={handleUnlike}
          className="insideBlogLike"
        />
      </div>

      {/* Blog comments section */}
      <div className="BlogComments">
        <div className="blogCommentTitle"> Comments</div>
        <div className="insideBlogComment">
          <div className="flex flex-col space-y-5">
            <input
              type="text"
              placeholder="Enter Your Thoughts !"
              className="blogCommentTextArea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
          </div>
          {showAlert && (
            <Alert
              message="Please login to comment"
              onClose={handleAlertClose}
            />
          )}
        </div>
        <div className="blog-comments-section">
          {comments.map((c) => (
            <BlogComment key={c._id} c={c} fetchBlogComments={fetchBlogComments} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsidePost;