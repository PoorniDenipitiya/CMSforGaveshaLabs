import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; 
const QuestionCard = ({ question, onDelete }) => {
  const hasIncrementedView = useRef(false);
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/details/${userId}`
      );
      if (!response.ok) {
        throw new Error("network response was not ok");
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("error fetching user data", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await fetchUserData(question.postedBy);
        setAuthor(userData);
        
      } catch (error) {
        console.error("error fetching author", error);
      }
    };
    fetchAuthor();
  }, [question.postedBy]);

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

  const incrementView = async (postId) => {
    try {
      console.log(`Sending request to increment view count for post ID: ${postId}`);
      await axios.put(`http://localhost:5000/api/questions/views/${postId}`);
      console.log(`Successfully incremented view count for post ID: ${postId}`);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleCardClick = () => {
    if (!hasIncrementedView.current) {
      incrementView(question._id);
      hasIncrementedView.current = true;
    }
  };
  const handleDelete = () => {
    const confirmation = window.confirm("Are you sure you want to delete the post?");
    if (confirmation) {
      onDelete(question._id);
      navigate('/MyQuestions')
    }
  };

  return (
    <div onClick={handleCardClick} className='cardBox' style={{ border: '1px solid', marginBottom: '15px', padding: '20px', borderRadius: '25px', boxShadow: '2px 2px 2px' }}>
<Link
            key={question._id}
            style={{ textDecoration: 'none' }} 
            to={`/viewquestion/${question._id}`}
          >
      <div>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#101318', marginBottom: '5px' }}>
          {question.title}
        </div>
        <div className="profile">
          {author&&(
            <div className="profilepic">
              <img src={author.profilePicture} alt={author.username} className="authorProfilePicture"/>
              <p className="authorUsername"> {author.username} </p>
            </div>

          )}
          <div style={{ fontSize: 14, fontWeight: '400', color: '#7E8597', marginLeft: '15px' }} className="postedtime">{formatDate(question.date)}</div>
        </div>
        
      </div></Link> 
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: 16, fontWeight: '400', color: '#5C677D', height: '50px', overflow: 'hidden' }}>{question.description}</div>
      </div>
      <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
        <div style={{ fontSize: 14, fontWeight: '400', color: '#7E8597' }}>Views {Math.floor(question.viewCount)}</div>
        {/* <div style={{ fontSize: 14, fontWeight: '400', color: '#7E8597' }}>Replies</div> */}
        <button onClick={handleDelete} className="editButton">
              <CIcon
                icon={icon.cilTrash}
                size="20px"
                style={{ "--ci-primary-color": "red" }}
              />
      </button>
      </div>
      
    </div>
  );
};

export default QuestionCard;