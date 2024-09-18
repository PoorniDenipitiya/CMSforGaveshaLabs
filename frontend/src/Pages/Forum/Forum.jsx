
import React, { useEffect, useState } from 'react';
import './Forum.css';
import QuestionCard from './QuestionCard';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Alert from "../../Component/Alert/Alert";
import { useUsers } from "../../Context/UserContext"; // Import user context
import searchIcon from '../../Component/Assets/search.png'; // Importing the search icon image 

export const Forum = ({ defaultValue = "" }) => {
  const navigate = useNavigate();
  const { user } = useUsers(); // Access user data from context
  const [showAlert, setShowAlert] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const [prompt, setPrompt] = useState(defaultValue); // State variable to hold the search query
  const [isFocused, setIsFocused] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setPrompt(defaultValue); // Set the default value when it changes
  }, [defaultValue]);

  const handleSearch = () => {
    if (prompt) {
      navigate(`/questionsearch?query=${prompt}`);
    } else {
      navigate("/forum");
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/questions');
        const sortedQuestions = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setQuestions(sortedQuestions);
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestions();
  }, []);

  const handleClick = () => {
    if (!user) {
      setShowAlert(true);
    } else {
      navigate('/questionform');
    }
  };

  const handleAlertClose = () => {
    const scrollPosition = window.scrollY;
    setShowAlert(false);
    navigate('/login', { state: { from: location, scrollPosition } });
  };

  // Logic to calculate pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='forumBody'>
      <div className='upperbody'>
        <div className='forumtext'>Welcome to the Community!</div>
        <div className='forumButton'>
          <div className="shopsearch" style={{
            height: '30px',
            width: '300px',
            border: 'none',
            display: 'flex',
            marginTop: '65px',
            backgroundColor: 'white',
            color: '#000',
            fontWeight: '600',
            fontSize: '13px',
            fontFamily: 'cursive',
            paddingLeft: '20px',
            marginLeft: '60px',
            borderRadius: '5px',
            boxShadow: '4px 2px 10px black'
          }}>
            <input
              type="text"
              className="searchBar"
              placeholder="Search for more.."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                height: '30px',
                width: '300px',
                border: isFocused ? '1px solid white' : 'none',
                backgroundColor: 'white',
                color: '#000',
                fontSize: '13px',
                fontFamily: 'cursive',
                paddingLeft: '20px',
                margin: '0',
                outline: 'none',
              }}
            />
            <img
              src={searchIcon} // Source of the search icon image
              className="searchshopIcon" // CSS class for the search icon
              onClick={handleSearch} // Function to navigate based on the search query
              alt="Search Icon"
              style={{
                height: '20px',
                width: '30px',
                backgroundColor: 'transparent',
                marginTop: '5px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                paddingRight: '2px'
              }}
            />
          </div>
          
          <button onClick={handleClick}>Ask Question</button>
          {showAlert && (
            <Alert
              message="Please login to ask questions."
              onClose={handleAlertClose}
            />
          )}
        </div>
      </div>
      <div className='questionArea' style={{ width: '980px', marginLeft: '200px', marginTop: '45px' }}>
        {currentQuestions.map((question) => (
          <Link
            key={question._id}
            style={{ textDecoration: 'none' }}
            to={`/viewquestion/${question._id}`}
          >
            <QuestionCard question={question} />
          </Link>
        ))}
      </div>
      {/* Pagination controls */}
      <div className='pagination' style={{ marginLeft: '900px' }}>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='b1'>
          Previous
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentQuestions.length < questionsPerPage} className='b2'>
          Next
        </button>
      </div>
    </div>
  );
};

export default Forum;
