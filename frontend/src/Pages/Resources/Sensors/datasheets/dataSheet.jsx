import React, { useEffect, useState } from "react";
import {Link, useLocation } from "react-router-dom";
import "../Sensors.css";
import "../Sidebar.css";
import Datasheetcard from "../../Sensors/datasheets/Datasheetcard";
import { URL } from "../../../../url"; // Assuming URL is correctly imported from 'url.js'
import axios from "axios";
import upload from "../../Assets/upload.png";

export const DataSheet = () => {
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
      setResoPosts(res.data);
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

        <tbody>
          <tr>
            <Link to="/dataSheet?category=Sensor Data Sheets" className={getLinkClassName("Sensor Data Sheets")}>
              <td>Sensor Data Sheets</td>
            </Link>
          </tr>
          <tr>
            <Link to="/dataSheet?category=Microcontroller Data Sheets" className={getLinkClassName("Microcontroller Data Sheets")}>
              <td>Microcontroller Data Sheets</td>
            </Link>
          </tr>
          <tr>
            <Link to="/dataSheet?category=Communication Module Data Sheets" className={getLinkClassName("Communication Module Data Sheets")}>
              <td>Communication Module Data Sheets</td>
            </Link>
          </tr>
          <tr>
            <Link to="/dataSheet?category=Power Management IC Data Sheets" className={getLinkClassName("Power Management IC Data Sheets")}>
              <td>Power Management IC Data Sheets</td>
            </Link>
          </tr>
          <tr>
            <Link to="/dataSheet?category=Component Specifications" className={getLinkClassName("Component Specifications")}>
              <td>Component Specifications</td>
            </Link>
          </tr>
        </tbody>
      </table>
    </div>


      <div className="reso-content-container">

      <div className="dataheader"> 

    <Link to ="/datasheetwrite">
    <button className="databutton"> {upload && (
                  <img src={upload} alt="upload" className="databutton-icon" />
                )} Upload</button>
    </Link>
  </div>
  
        <div className="res-posts-container">
          {filteredPosts.length > 0 ? (
            currentPosts.map((resoPost) => (
              <Datasheetcard key={resoPost.id} resoPost={resoPost} />
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





