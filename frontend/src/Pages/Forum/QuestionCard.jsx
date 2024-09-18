
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "./QuestionCard.css"; 

const QuestionCard = ({ question }) => {
  const hasIncrementedView = useRef(false);
  const [author, setAuthor] = useState(null);
 
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
        console.log(userData);
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

  return (
    <div onClick={handleCardClick} className='cardBox'>
      <div>
        <div className="cardTitle">
          {question.title}
        </div>
        <div className="profile">
          {author && (
            <div className="profilepic">
              <img src={author.profilePicture} alt={author.username} className="authorProfilePicture" />
              <p className="authorUsername">{author.username}</p>
            </div>
          )}
          <div className="postedtime">{formatDate(question.date)}</div>
        </div>
      </div>
      <div className="description">
        {question.description}
      </div>
      <div className="info">
        <div>Views {Math.floor(question.viewCount)}</div>
      </div>
    </div>
  );
};

export default QuestionCard;
