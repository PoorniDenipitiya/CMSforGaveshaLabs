import React, { useEffect, useState } from "react";
import { useParams,useNavigate ,useLocation} from "react-router-dom";
import axios from "axios";
import { URL } from "../../url"; // Ensure this is correctly imported
import { Forumreply } from "./Forumreply";
import { useUsers } from "../../Context/UserContext";
import Alert from "../../Component/Alert/Alert";

const ViewQuestion = () => {
  const [question, setQuestion] = useState(null); 
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [author, setAuthor] = useState(null);
  const { user } = useUsers();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${URL}/api/auth/details/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data", error);
      throw error;
    }
  };
  
  

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${URL}/api/questions/${id}`);
      const data = response.data;
      setQuestion(data);
      if (data.postedBy) {
        const userData = await fetchUserData(data.postedBy);
        setAuthor(userData);
      }
    } catch (error) {
      console.error("Failed to fetch question", error);
      setQuestion(null);
    }
  };

  const fetchPostComments = async () => {
    try {
      const response = await axios.get(`${URL}/api/answer/answer/${id}`);
      setAnswers(response.data);
    } catch (error) {
      console.error("Failed to fetch post comments", error);
      setAnswers([]);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchPostComments();
  }, [id]);

  const postComment = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    if (user && user._id) {
      try {
        await axios.post(
          `${URL}/api/answer/create`,
          { answer, postId: id, postedBy: user._id }, // Include postedBy field
          { withCredentials: true }
        );
        fetchPostComments();
        setAnswer("");
      } catch (error) {
        console.error("Error posting comment", error);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        }
        // Handle errors as needed
      }
    } else {
      setShowAlert(true);
    }
    
  };
  const handleAlertClose = () => {
    const scrollPosition = window.scrollY;

    setShowAlert(false);
    navigate('/login', { state: {  from: location, scrollPosition } });
  };
  
  const formatDate = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);

    const dateDiff = currentDate.getTime() - postDate.getTime();
    const seconds = Math.floor(dateDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  }; 
  return (
    <div>
      {question ? (
        <div className="question-container">
          <h2 className="question-title">{question.title}</h2>
          <div className="profiledetails">
            {author && (
              <div className="profilepic">
                <img src={author.profilePicture} alt={author.username} className="authorProfilePicture" />
                <p className="authorUsername">{author.username}</p>
              </div> 
            )}
            <div style={{ fontSize: 14, fontWeight: '400', color: '#7E8597', marginLeft: '15px' }} className="postedtime">{formatDate(question.date)}</div>

          </div>
          <hr />
          <div className="question-details">
            <p className="question-description">{question.description}</p>
            {question.imageUrl && (
              <img className="question-image" src={question.imageUrl} alt="Question" />
            )}
          </div>
          <div className="forum-comments-section">
            <h3>Reply:</h3>
            <div className="forum-write-comment">
              <textarea
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                placeholder="Write Your Reply"
                className="forumcomsection"
              />
              <button onClick={postComment}>Reply</button>
              {showAlert && (
            <Alert
              message="Please login to reply"
              onClose={handleAlertClose}
            />
          )}
            </div>
            <hr style={{ boxShadow: "0 0 2px " }} />
            {answers.map((answer) => (
              <Forumreply key={answer._id} answer={answer} fetchPostComments={fetchPostComments} />
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewQuestion;
