import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Question from "./QuestionCard"
import "../../Pages/Resources/Sensors/Sensors.css";
import { URL } from "../../url";
import searchIcon from '../../Component/Assets/search.png'; // Importing the search icon image
import {useNavigate } from "react-router-dom";

export const QuestionSearch = ({ defaultValue = "" }) => { 
    const { search } = useLocation();
    const [noResults, setNoResults] = useState(false);
    
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    const [searchInitiated, setSearchInitiated] = useState(false);
  
    const navigate = useNavigate(); // Use useNavigate hook
    const [prompt, setPrompt] = useState(defaultValue); 

    const handleSearch = () => {
        if (prompt) {
          navigate(`/questionsearch?query=${prompt}`);
        } else {
          navigate("/forum");
        }
      };

    const queryParams = new URLSearchParams(search);
    const query = queryParams.get("query");
  
    console.log("Search query:", query);
  
    const fetchPosts = async () => {
      try { 
        const [ questionRes] = await Promise.all([
          
            axios.get(`${URL}/api/questions?search=${query}`),
        ]);
  
        
        console.log("Fetched questions:", questionRes.data);
  
        
        setQuestions(Array.isArray(questionRes.data.data) ? questionRes.data.data : []);
  
        if (
         
            questionRes.data.length === 0
        ) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
    };
  
    useEffect(() => {
      if (query) {
        setSearchInitiated(true); 
        fetchPosts();
      }
    }, [query]);
  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    
    const currentquestions = questions.slice(indexOfFirstPost, indexOfLastPost);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <div className="sensorsCollect">
        <div className="reso-content-container" style={{ marginTop: "25px" }}>
        <div
  className="ResoSearchDiv"
  style={{
    position: 'absolute',
    display: 'flex',
    top: '20%',
    left: '40%',
    height: '30px',
    width: '300px',
    border: 'none',
    backgroundColor: 'white',
    color: '#000',
    fontSize: '13px',
    fontFamily: 'cursive',
    paddingLeft: '20px',
    margin: '0',
    boxShadow:'0 0 10px grey'
  }}
>
  <input
    type="text"
    className="searchBar"
    placeholder="Search for more.."
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    style={{
      height: '30px',
      width: '300px',
      border: 'none',
      backgroundColor: 'white',
      color: '#000',
      fontSize: '13px',
      fontFamily: 'cursive',
      paddingLeft: '20px',
      margin: '0',
    }}
  />
  <img
    src={searchIcon}
    className="searchIcon"
    onClick={handleSearch} 
    alt="Search Icon"
    style={{
      height: '20px',
      width: '30px',
      backgroundColor: 'transparent',
      marginTop: '15px',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    }}
  />
</div>
  
  
          {searchInitiated && (
            <div className="res-posts-container" style={{marginTop:'100px'}}>
              {!noResults ? (
                <>
                  
                  {currentquestions.map((question) => (
                  <Question key={question.id} question={question} />
                ))}
                </>
              ) : (
                <h3>No Posts Available</h3>
              )}
            </div>
          )}
  
          {searchInitiated &&
            !noResults &&
            (
                questions.length > 0) && (
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={  questions.length}
                paginate={paginate}
              />
            )}
        </div>
      </div>
    );
  };
  
  const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
};
