
import React from "react";
import Pagination from "@mui/material/Pagination";
import "./ProjectPgNavi.css";

export const ProjectPgNavi = ({totalPosts, postsPerPage, onPageChange, currentPage }) => {
  const handleChange = (event, page) => {
    onPageChange(page);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="project_pagiantion">
      <Pagination count={totalPages} color="secondary" page={currentPage} onChange={handleChange} />
    </div>
  );
};

export default ProjectPgNavi;
