
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Resourcepost from "../../Pages/Resources/Resourcepost";
import Datasheetcard from "../../Pages/Resources/Sensors/datasheets/Datasheetcard";
import "../../Pages/Resources/Sensors/Sensors.css";
import { URL } from "../../url";
import searchIcon from '../../Component/Assets/search.png'; // Importing the search icon image
import {useNavigate } from "react-router-dom";

export const ResoSearch = ({ defaultValue = "" }) => { 
  const { search } = useLocation(); 
  const [noResults, setNoResults] = useState(false);
  const [resoPosts, setResoPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const navigate = useNavigate(); // Use useNavigate hook
  const [prompt, setPrompt] = useState(defaultValue); // State variable to hold the search query

  const handleSearch = () => {
    if (prompt) {
      navigate(`/resosearch?query=${prompt}`);
    } else {
      navigate("/resources");
    }
  };

  const queryParams = new URLSearchParams(search);
  const query = queryParams.get("query");

  console.log("Search query:", query);

  const fetchPosts = async () => {
    try {
      const [resoRes] = await Promise.all([
        axios.get(`${URL}/api/resoposts?search=${query}`),
      ]);
      console.log("Fetched reso posts:", resoRes.data);

      setResoPosts(resoRes.data);

      if (resoRes.data.length === 0) {
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
  const currentResoPosts = resoPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="sensorsCollect">
      <div className="reso-content-container">
      <div className="ResopageSearchDiv" style={{marginTop:'25px',boxShadow:'0 0 10px grey',position:'absolute'}}>
          <input
            type="text"
            className="searchBar" // CSS class for the search bar input
            placeholder="Search for more.." // Placeholder text for the search bar
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // Function to update the search query state on input change
          />
          <img
            src={searchIcon} // Source of the search icon image
            className="searchIcon" // CSS class for the search icon
            onClick={handleSearch} // Function to navigate based on the search query
            alt="Search Icon" // Alt text for the search icon image
          />
        </div>
        <br/>
<div className="resoresults">
        {searchInitiated && (
          <div className="res-posts-container">
            {!noResults ? (
              <>
                {currentResoPosts.map((resoPost) => {
                  if (resoPost.pdf) {
                    return <Datasheetcard key={resoPost.id} resoPost={resoPost} />;
                  } else {
                    return <Resourcepost key={resoPost.id} resoPost={resoPost} />;
                  }
                })}
              </>
            ) : (
              <h3>No Posts Available</h3>
            )}
          </div>
        )}
</div>

        {searchInitiated && !noResults && (resoPosts.length > 0) && (
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={resoPosts.length}
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
