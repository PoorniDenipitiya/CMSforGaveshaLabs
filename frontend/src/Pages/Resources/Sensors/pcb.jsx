import React, { useEffect, useState } from "react";
import {Link, useLocation } from "react-router-dom";
import "./Sensors.css";
import "./Sidebar.css";
import Resourcepost from "../Resourcepost";
import { URL } from "../../../url"; // Assuming URL is correctly imported from 'url.js'
import axios from "axios";

export const Pcb = () => {
  const { search } = useLocation();
  const [noResults, setNoResults] = useState(false);
  const [resoPosts, setResoPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const location = useLocation();
  const currentCategory = new URLSearchParams(location.search).get("category");

  const getLinkClassName = (category) => {
    return currentCategory === category ? "nav active" : "nav";
  };

  const fetchResoPosts = async () => {
    try {
      const res = await axios.get(`${URL}/api/resoposts`);
      setResoPosts(res.data.filter(
        (resoPost) => resoPost.approved
      ));
      setNoResults(res.data.length === 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResoPosts();
  }, []);

  const queryParams = new URLSearchParams(search);
  const selectedCategory = queryParams.get('category');

  const filteredPosts = selectedCategory
    ? resoPosts.filter(post => post.categories.includes(selectedCategory))
    : resoPosts;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="sensorsCollect">
      
      <div className="sidebar">
      <table>
        {/* <thead>
          <tr>
            <Link to="/pcb" className={getLinkClassName(null)}>
              <th>All Categories</th>
            </Link>
          </tr>
        </thead> */}
        <tbody>
          <tr>
            <Link to="/pcb?category=Design Software" className={getLinkClassName("Design Software")}>
              <td>Design Software</td>
            </Link>
          </tr>
          <tr>
            <Link to="/pcb?category=Manufacturing Services" className={getLinkClassName("Manufacturing Services")}>
              <td>Manufacturing Services</td>
            </Link>
          </tr>
          <tr>
            <Link to="/pcb?category=Components Sourcing" className={getLinkClassName("Components Sourcing")}>
              <td>Components Sourcing</td>
            </Link>
          </tr>
          <tr>
            <Link to="/pcb?category=PCB Layout Techniques" className={getLinkClassName("PCB Layout Techniques")}>
              <td>PCB Layout Techniques</td>
            </Link>
          </tr>
          <tr>
            <Link to="/pcb?category=Assembly and Soldering" className={getLinkClassName("Assembly and Soldering")}>
              <td>Assembly and Soldering</td>
            </Link>
          </tr>
          <tr>
            <Link to="/pcb?category=Testing and Validation" className={getLinkClassName("Testing and Validation")}>
              <td>Testing and Validation</td>
            </Link>
          </tr>
        </tbody>
      </table>
    </div>

      <div className="reso-content-container">
        <div className="res-posts-container">
          {filteredPosts.length > 0 ? (
            currentPosts.map((resoPost) => (
              <Resourcepost key={resoPost.id} resoPost={resoPost} />
            ))
          ) : (
            <h3>No Posts Available</h3>
          )}
          {noResults && <p>No results found for your search.</p>}
        </div>
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={filteredPosts.length}
          paginate={paginate}
        />
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