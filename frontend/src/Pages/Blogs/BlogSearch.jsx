import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Blogpost from "../../Pages/Blogs/Blogspost"; // Import the Blogpost component
import "../../Pages/Blogs/Blog.css";
import { URL } from "../../url";
import searchIcon from '../../Component/Assets/search.png'; // Importing the search icon image
import {useNavigate } from "react-router-dom";

export const BlogSearch = ({ defaultValue = "" }) => {
  const { search } = useLocation();
  const [noResults, setNoResults] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]); // State to store blog posts
  const [currentPage, setCurrentPage] = useState(1); 
  const [postsPerPage] = useState(6);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const navigate = useNavigate(); // Use useNavigate hook
  const [prompt, setPrompt] = useState(defaultValue); // State variable to hold the search query

  const handleSearch = () => {
    if (prompt) {
      navigate(`/blogsearch?query=${prompt}`);
    } else {
      navigate("/blogs");
    }
  };

  const queryParams = new URLSearchParams(search);
  const query = queryParams.get("query");

  console.log("Search query:", query);

  const fetchPosts = async () => {
    try {
      const [blogRes] = await Promise.all([
        axios.get(`${URL}/api/blogposts?search=${query}`), // Fetch blog posts
      ]);
      console.log("Fetched blog posts:", blogRes.data);

      setBlogPosts(blogRes.data);

      if (blogRes.data.length === 0) {
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
  const currentBlogPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="sensorsCollect">
      <div className="blog-content-container">
      <div
  className="ResoSearchDiv"
  style={{
    position: 'absolute',
    display: 'flex',
    top: '15%',
    left: '35%',
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
      marginTop: '16px',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    }}
  />
</div>
        {searchInitiated && (
          <div className="bpost" style={{marginTop:'100px', marginLeft:'600px'}}>
            {!noResults ? (
              <>
                {currentBlogPosts.map((blogPost) => (
                  <Blogpost key={blogPost.id} blogPost={blogPost} />
                ))}
              </>
            ) : (
              <h3>No Posts Available</h3>
            )}
          </div>
        )}

        {searchInitiated && !noResults && (blogPosts.length > 0) && (
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={blogPosts.length}
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