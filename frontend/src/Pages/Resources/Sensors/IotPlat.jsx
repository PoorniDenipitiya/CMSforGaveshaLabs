import React, { useEffect, useState } from "react";
import {Link, useLocation } from "react-router-dom";
import "./Sensors.css";
import "./Sidebar.css";
import Resourcepost from "../Resourcepost";
import { URL } from "../../../url"; // Assuming URL is correctly imported from 'url.js'
import axios from "axios";

export const IotPlat = () => {
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
            <Link to="/IotPlat" className={getLinkClassName(null)}>
              <th>All Categories</th>
            </Link>
          </tr>
        </thead> */}
        <tbody>
          <tr>
            <Link to="/IotPlat?category=IoT Platforms" className={getLinkClassName("IoT Platforms")}>
              <td>IoT Platforms</td>
            </Link>
          </tr>
          <tr>
            <Link to="/IotPlat?category=Cloud Storage Solutions" className={getLinkClassName("Cloud Storage Solutions")}>
              <td>Cloud Storage Solutions</td>
            </Link>
          </tr>
          <tr>
            <Link to="/IotPlat?category=Data Analytics" className={getLinkClassName("Data Analytics")}>
              <td>Data Analytics</td>
            </Link>
          </tr>
          <tr>
            <Link to="/IotPlat?category=Device Management" className={getLinkClassName("Device Management")}>
              <td>Device Management</td>
            </Link>
          </tr>
          <tr>
            <Link to="/IotPlat?category=Integration and APIs" className={getLinkClassName("Integration and APIs")}>
              <td>Integration and APIs</td>
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