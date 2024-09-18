import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Resourcepost from "../../Pages/Resources/Resourcepost";
import Blogpost from "../../Pages/Blogs/Blogspost";
import Projectpost from "../../Pages/Project/ProjectCard";
import Shoppost from "../../Pages/Shopping/Shopcard";
import Question from "../../Pages/Forum/QuestionCard"
import "../../Pages/Resources/Sensors/Sensors.css"; 
import Datasheetcard from "../../Pages/Resources/Sensors/datasheets/Datasheetcard";
import { URL } from "../../url";
import { Search } from "./Search";
 
export const SearchResults = () => {
  const { search } = useLocation();
  const [noResults, setNoResults] = useState(false);
  const [resoPosts, setResoPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [projectPosts, setProjectPosts] = useState([]);
  const [shopPosts, setShopPosts] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const queryParams = new URLSearchParams(search);
  const query = queryParams.get("query");

  console.log("Search query:", query);

  const fetchPosts = async () => {
    try {
      const [resoRes, blogRes, projectRes, shopRes, questionRes] = await Promise.all([
        axios.get(`${URL}/api/resoposts?search=${query}`),
        axios.get(`${URL}/api/blogposts?search=${query}`),
        axios.get(`${URL}/api/projectposts?search=${query}`),
        axios.get(`${URL}/api/shoppost?search=${query}`),
        axios.get(`${URL}/api/questions?search=${query}`),
      ]);

      console.log("Fetched reso posts:", resoRes.data);
      console.log("Fetched blog posts:", blogRes.data);
      console.log("Fetched project posts:", projectRes.data);
      console.log("Fetched shop posts:", shopRes.data);
      console.log("Fetched questions:", questionRes.data);

      setResoPosts(Array.isArray(resoRes.data) ? resoRes.data : []);
      setBlogPosts(Array.isArray(blogRes.data) ? blogRes.data : []);
      setProjectPosts(Array.isArray(projectRes.data) ? projectRes.data : []);
      setShopPosts(Array.isArray(shopRes.data.data) ? shopRes.data.data : []);
      setQuestions(Array.isArray(questionRes.data.data) ? questionRes.data.data : []);

      if (
        resoRes.data.length === 0 &&
        blogRes.data.length === 0 &&
        projectRes.data.length === 0 &&
        shopRes.data.length === 0 &&
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
  const currentResoPosts = resoPosts.slice(indexOfFirstPost, indexOfLastPost);
  const currentBlogPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const currentProjectPosts = projectPosts.slice(indexOfFirstPost, indexOfLastPost);
  const currentShopPosts = shopPosts.slice(indexOfFirstPost, indexOfLastPost);
  const currentquestions = questions.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="sensorsCollect">
      <div className="reso-content-container" style={{ marginTop: "25px" }}>
        <div className="sea" style={{marginBottom:'35px'}}>
        <Search defaultValue={query} />
</div>
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
                {currentBlogPosts.map((blogPost) => (
                  <Blogpost key={blogPost.id} blogPost={blogPost} />
                ))}
                {currentProjectPosts.map((projectpost) => (
                  <Projectpost key={projectpost.id} projectpost={projectpost} />
                ))}
                {currentShopPosts.map((shoppost) => (
                  <Shoppost key={shoppost.id} shoppost={shoppost} />
                ))}
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
          (resoPosts.length > 0 ||
            blogPosts.length > 0 ||
            projectPosts.length > 0 ||
            shopPosts.length > 0 ||
            questions.length > 0) && (
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={resoPosts.length + blogPosts.length + projectPosts.length + shopPosts.length +questions.length }
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
