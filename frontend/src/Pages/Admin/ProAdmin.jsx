import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavi from "./AdminNavi";
import axios from "axios";
import { URL } from "../../url";
import AOS from "aos";
import "aos/dist/aos.css";
import "./ProAdmin.css";

const ProAdmin = () => {
  const [projectPosts, setProjectPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    AOS.refresh(); // Refresh AOS on component mount/update
  }, []);

  useEffect(() => {
    const fetchProjectPosts = async () => {
      try {
        const response = await axios.get(`${URL}/api/projectposts`);
        setProjectPosts(response.data);
      } catch (error) {
        console.error("Error fetching project posts:", error);
      }
    };

    fetchProjectPosts();
  }, []);

  useEffect(() => {
    const filteredProjects = projectPosts.filter((projectpost) => {
      if (selectedStatus === "pending") return !projectpost.approved && !projectpost.rejected;
      if (selectedStatus === "approved") return projectpost.approved;
      if (selectedStatus === "rejected") return projectpost.rejected;
      return true;
    });
    setFilteredPosts(filteredProjects);
    setCurrentPage(1); // Reset to the first page whenever the status filter changes
  }, [selectedStatus, projectPosts]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (projectId) => {
    const confirmMessage = "Are you sure you want to delete this project?";
    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${URL}/api/projectposts/${projectId}`);
      // Refresh the project list after deletion
      const updatedProjects = projectPosts.filter((project) => project._id !== projectId);
      setProjectPosts(updatedProjects);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div data-aos="fade-up">
      <AdminNavi />
      <div className="proAdmin_content" >
        <h1  style={{marginTop:"80px"}}>Projects Page</h1> <br></br>
        <div className="proAdmin_filter-dropdown">
          <label htmlFor="statusFilter">Select Status: </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
                marginLeft: "10px",
                borderRadius: "5px",
                backgroundColor: "pink",
              }}
          >
            <option value="all">All</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <table className="proAdmin_table">
          <thead>
            <tr className="proAdmin_tr">
              <th className="proAdmin_th">Name</th>
              <th className="proAdmin_th">Project Name</th>
              <th className="proAdmin_th">Email</th>
              <th className="proAdmin_th">Time</th>
              <th className="proAdmin_th">Status</th>
              <th className="proAdmin_th">View</th>
              {selectedStatus === "rejected" && <th className="proAdmin_th">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((projectpost) => (
              <tr key={projectpost._id} className="proAdmin_tr">
                <td className="proAdmin_td">{projectpost.name}</td>
                <td className="proAdmin_td">{projectpost.project_name}</td>
                <td className="proAdmin_td">{projectpost.email}</td>
                <td className="proAdmin_td">
                  {new Date(projectpost.createdAt).toLocaleString()}
                </td>
                <td className="proAdmin_td">
                  {projectpost.approved
                    ? "Approved"
                    : projectpost.rejected
                    ? "Rejected"
                    : "Pending Approval"}
                </td>
                <td className="proAdmin_td">
                  <Link to={`/viewprojectadmin/${projectpost._id}?status=${selectedStatus}`}>
                  <button style={{borderRadius:"10px", color:"white", background:"rgb(95, 95, 228)", padding:"5px", cursor:"pointer"}}> See More </button>
                  </Link>
                </td>

                {selectedStatus === "rejected" && (
                  <td className="proAdmin_td">
                    <button
                      style={{borderRadius:"10px", color:"white", background:"red", padding:"5px", cursor:"pointer"}}
                      onClick={() => handleDelete(projectpost._id)}
                    >
                      Delete
                    </button>
                    </td>
                )}
                 
              </tr>
            ))}
          </tbody>
        </table>
        <div className="proAdmin_pagination">
          {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`proAdmin_pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProAdmin;