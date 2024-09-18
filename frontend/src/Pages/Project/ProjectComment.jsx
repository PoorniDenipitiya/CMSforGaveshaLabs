import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { URL } from "../../url";
import "./ProjectComment.css";
import { useUsers } from "../../Context/UserContext";
import { formatDistanceToNow, format } from "date-fns";

export const ProjectComment = ({ c, fetchProjectComments }) => {
  const [reply, setReply] = useState("");
  const [author, setAuthor] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // State to toggle display of replies
  const { user } = useUsers();

  const deleteComment = async (id) => {
    // Confirm deletion with the user
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return; // If user cancels, do nothing

    try {
      await axios.delete(`${URL}/api/projectcomments/${id}`, {
        withCredentials: true,
      });
      fetchProjectComments();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${URL}/api/auth/details/${userId}`);
      const userData = await response.json();
      return userData; // Return parsed JSON data
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await fetchUserData(c.postedBy);
        setAuthor(userData); // Set author data
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [c.postedBy]);

  const postReply = async (e) => {
    e.preventDefault();
    try { 
      await axios.post(
        `${URL}/api/projectcomments/create`,
        { comment: reply, postId: c.postId, parentId: c._id, postedBy: user._id },
        { withCredentials: true }
      );
      fetchProjectComments();
      setReply("");
      setShowReplyInput(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle function to show/hide replies
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  // Render only if author is fetched
  if (!author) return null;
  const createdAtDate = new Date(c.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const formattedDate = format(createdAtDate, "MMM dd");

  return (
    <div className="blog-comment">
      <div className="comment-header">
        <div className="comment-user">
          <img src={author.profilePicture} alt="" className="authorProfilePicture" />
          <h5>{author.username}</h5>
          <h6>
            {createdAtDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ? timeAgo
              : formattedDate}
          </h6>
        </div>
        <div className="comment-actions">
  {user && author._id === user._id && (
    <MdDelete onClick={() => deleteComment(c._id)} />
  )}
  <button onClick={() => setShowReplyInput(!showReplyInput)}>Reply</button>
  {c.replies && c.replies.length > 0 && (
    <button onClick={toggleReplies}>
      {showReplies ? "Hide Replies" : "Show Replies"}
    </button>
  )}
</div>

      </div>
      <p>{c.comment}</p>
      {showReplyInput && (
        <div className="write-reply">
          <input
            onChange={(e) => setReply(e.target.value)}
            type="text"
            value={reply}
            placeholder="Write a reply"
            className="reply-input"
          />
          <button onClick={postReply}>Add Reply</button>
          <button onClick={() => setShowReplyInput(false)}>Cancel</button>
        </div>
      )}
      {showReplies && (
        <div className="comment-replies">
          {c.replies &&
            c.replies.map((reply) => (
              <ProjectComment
                key={reply._id}
                c={reply}
                fetchProjectComments={fetchProjectComments}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectComment;