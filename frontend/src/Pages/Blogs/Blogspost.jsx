import React, { useState, useEffect } from "react";
import "./Blogspost.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

import * as icon from "@coreui/icons"; 
import CIcon from "@coreui/icons-react";
import { useUsers } from "../../Context/UserContext";
import ShareBox from './ShareBox';
import { formatDistanceToNow, format } from 'date-fns';
import Notification from './BlogNotification';

const Blogspost = ({ blogPost }) => {
  const [author, setAuthor] = useState(null);
  const { user } = useUsers();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(blogPost.likes.length);
  const [liked, setLiked] = useState(false);
  const [unLiked, setUnLiked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [showShareBox, setShowShareBox] = useState(false);
  const navigate = useNavigate();

  const shareUrl = `http://localhost:3000/InsidePost/${blogPost._id}`;
  const location = useLocation();

  useEffect(() => {
    // Restore scroll position upon navigating back from login
    if (location.state?.scrollPosition) {
      window.scrollTo(0, location.state.scrollPosition);
    }
  }, [location.state?.scrollPosition]);


  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/details/${userId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetchUserData(blogPost.postedBy);
        const userData = await response.json();
        setAuthor(userData); // Set author data
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [blogPost.postedBy]);

  useEffect(() => {
    // Check if the post is bookmarked by the user and update the state
    const checkBookmark = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/bookMarks/${user._id}`
          );
          const bookmarks = response.data;
          const isBookmarked = bookmarks.some(
            (bookmark) => bookmark.blogPost === blogPost._id
          );
          setIsBookmarked(isBookmarked);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      }
    };

    checkBookmark();
  }, [blogPost._id, user]);

  const createdAtDate = new Date(blogPost.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const formattedDate = format(createdAtDate, "MMM dd");

  const handleBookmark = async () => {
    if (user) {
      try {
        // If bookmark doesn't exist, add it
        await axios.post(`http://localhost:5000/api/bookMarks/bookmark`, {
          userId: user._id,
          blogPostId: blogPost._id,
        });
        setIsBookmarked(true);
        setNotificationMessage('Bookmarked successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        console.log(error);
      }
    } else {
      const scrollPosition = window.scrollY;
      setTimeout(() => {
        window.alert("Please login to add Bookmarks.");
      }, 100);
      setTimeout(() => {
        navigate("/login", { state: {  from: location, scrollPosition } });
      }, 2000);
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
        navigate("/login", { state: {  from: location, scrollPosition } });
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
        navigate("/login", { state: {  from: location, scrollPosition } });
      }, 2000);
    }
  };



  const fetchBlogComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogComments/post/${blogPost._id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching blog comments:", err);
    }
  };

  useEffect(() => {
    fetchBlogComments();
  }, [blogPost._id]);

  const toggleShareBox = () => {
    setShowShareBox(!showShareBox);
  };

  console.log(shareUrl);

  return (
    <div className="mainBlogpostcard"style={{width: '380px' }}>
      <div className="BlogpostCard">
        {/* Link to view full blog post */}
        <Link
          style={{ textDecoration: "none" }}
          to={`/InsidePost/${blogPost._id}`}
          key={blogPost.id}
        >
          <img src={blogPost.photo} alt="" className="blogPostImage" />
          <div className="blogPostText">
            <div className="blogPostTitle">{blogPost.title}</div>
            <br />
            <div>
              <div className="blogPostDescription" dangerouslySetInnerHTML={{ __html: blogPost.desc.split(" ").slice(0, 30).join(" ") +
                    "... See more" }}>

              </div>
              <br />
            </div>
          </div>
        </Link>
      </div>
      <div className="blogCardFooterMainDIv">

        <div className="blogCardFooterRow">
       
          {author && (
             <Link style={{ textDecoration: "none" }} to={`/authorpage/${author._id}`} key={author.id}>
            <div className="BlogCardAuthorInfo">
              <img
                src={author.profilePicture}
                alt=""
                className="authorProfilePicture"
                style={{ height: '40px', width: '40px', borderRadius: '50%' }}
              />
              <p className="authorUsername"> {author.username} </p>
            </div>
            </Link>
          )}
          
        </div>
        <div className="blogCardFooterRow">
          <button className="BlogFooterkButton">
            <CIcon
              icon={icon.cilThumbUp}
              size=""
              style={{ color: liked ? "purple" : "black" }}
              onClick={handleLike}
              className="insideBlogLike"
            />
            <span className="likesCount">{likes} Likes</span>
          </button>
          <button className="BlogFooterkButton">
            <CIcon
              icon={icon.cilThumbDown}
              size=""
              style={{ color: unLiked ? "purple" : "black" }}
              onClick={handleUnlike}
              className="insideBlogLike"
            />
            <span className="CommentCount">
              <CIcon
                icon={icon.cilCommentBubble}
                size=""
                style={{ color:"black" }}
                className="insideBlogLike"
              />
             {comments.length}
            </span>
          </button>
        </div>
        <div className="blogCardFooterRow">
          <div className="blogPostDate">
            {createdAtDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ? timeAgo
              : formattedDate}
          </div>

          <div className="bookmarkWrapper">
  <button
    className="BlogFooterkButton"
    onClick={toggleShareBox}
  >
  
    <CIcon
      icon={icon.cilShareAlt}
      size=""
      style={{ color:"black" }}
      className="BlogFooteMarkIcon"
    />
  </button>
  {showShareBox && (<ShareBox postUrl={shareUrl} onClose={toggleShareBox} />)}
</div>


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
        </div>
      </div>
      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Blogspost;