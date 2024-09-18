import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/fa/check';
import { close } from 'react-icons-kit/fa/close';
import { mailReply } from 'react-icons-kit/fa/mailReply';
import { useUsers } from "../../Context/UserContext";
import Alert from "../../Component/Alert/Alert";
import { URL } from "../../url";
import "./Forum.css";
import { useNavigate ,useLocation} from "react-router-dom";  

export const Forumreply = ({ answer, fetchPostComments }) => {
  const [reply, setReply] = useState("");
  const { user } = useUsers();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [likes, setLikes] = useState(answer.likes || 0);
  const [dislikes, setDislikes] = useState(answer.dislikes || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [author, setAuthor] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false); // State for login alert
  const navigate = useNavigate(); 
  const location = useLocation();
  useEffect(() => {
    setLikes(answer.likes || 0);
    setDislikes(answer.dislikes || 0);
  }, [answer.likes, answer.dislikes]);

  const deleteComment = (id) => {
    setShowDeleteAlert(true); // Show the delete confirmation alert
  };

  const handleAlertClose = () => {
    confirmDelete(true); // Close the delete confirmation alert
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${URL}/api/answer/${answer._id}`, {
        withCredentials: true,
      });
      fetchPostComments(); // Refresh comments after deletion
      setShowDeleteAlert(false); // Close the alert after successful deletion
    } catch (err) {
      console.log(err);
      // Handle error appropriately (e.g., show error message)
    }
  };
  const handleAlertCloselogin = () =>{
    const scrollPosition = window.scrollY;
    setShowLoginAlert(false);
    navigate('/login', { state: {  from: location, scrollPosition } });
  }
  
  const postReply = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginAlert(true); // Show login alert if user is not logged in
      return;
    }
    try {
      await axios.post(
        `${URL}/api/answer/create`,
        { answer: reply, postId: answer.postId, parentId: answer._id, postedBy: user._id },
        { withCredentials: true }
      );
      fetchPostComments();
      setReply("");
      setShowReplyInput(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setShowLoginAlert(true); // Show login alert if user is not logged in
      return;
    }
    if (liked) return; // Prevent multiple likes
    try {
      const response = await axios.post(
        `${URL}/api/answer/update/${answer._id}`,
        { likes: 1, dislikes: disliked ? -1 : 0 },
        { withCredentials: true }
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setLiked(true);
      setDisliked(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      setShowLoginAlert(true); // Show login alert if user is not logged in
      return;
    }
    if (disliked) return; // Prevent multiple dislikes
    try {
      const response = await axios.post(
        `${URL}/api/answer/update/${answer._id}`,
        { likes: liked ? -1 : 0, dislikes: 1 },
        { withCredentials: true }
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setLiked(false);
      setDisliked(true);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleRepliesVisibility = () => {
    setShowReplies(!showReplies);
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`${URL}/api/auth/details/${answer.postedBy}`);
        setAuthor(response.data); // Set author data
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [answer.postedBy]);

  if (!author) return null;

  const sortedReplies = answer.replies?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="forum-comment">
      <div className="forum-comment-header">
        <div className="forum-com">
          <div className="forumcomuser">
            <h3>{author.username || "Anonymous"}</h3>
          </div>
          <div className="forumcomdate">
            <p>{new Date(answer.createdAt).toString().slice(0, 15)}</p>
          </div>
        </div>
        <div className="forum-comment-actions">
          {user && author._id === user._id && (
            <MdDelete onClick={() => deleteComment(answer._id)} className="deletebutton" />
          )}
          <button onClick={() => setShowReplyInput(!showReplyInput)} className="reply">
            <Icon icon={mailReply} />
          </button>
          <button onClick={handleLike} disabled={liked} className="like">
            <Icon icon={check} /> {likes}
          </button>
          <button onClick={handleDislike} disabled={disliked} className="dislike">
            <Icon icon={close} /> {dislikes}
          </button>
        </div>
      </div>
      <p>{answer.answer}</p>
      {showReplyInput && (
        <div className="forum-write-comment">
          <textarea
            onChange={(e) => setReply(e.target.value)}
            value={reply}
            placeholder="Write a reply"
            className="forumcomsection"
          />
          <button onClick={postReply}>Reply</button>
        </div>
      )}
      {answer.replies && answer.replies.length > 0 && (
        <button onClick={toggleRepliesVisibility} className="toggle-replies">
          {showReplies ? "Hide" : "Show"} Replies ({answer.replies.length})
        </button>
      )}
      {showReplies && (
        <div className="forum-comment-replies">
          {sortedReplies.map(reply => (
            <Forumreply key={reply._id} answer={reply} fetchPostComments={fetchPostComments} />
          ))}
        </div>
      )}
      {showDeleteAlert && (
        <Alert
          message="Are you sure you want to delete this comment?"
          onClose={handleAlertClose}
          onConfirm={confirmDelete}
        />
      )}
      {showLoginAlert && (
        <Alert
          message="Please log in "
          onClose={handleAlertCloselogin}
        />
      )}
    </div>
  );
};

export default Forumreply;
