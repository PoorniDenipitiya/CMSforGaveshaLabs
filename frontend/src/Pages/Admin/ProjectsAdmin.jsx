
import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
//import Admin from "./Admin";
import AdminNavi from "./AdminNavi";
import "./ProjectsAdmin.css";
import axios from "axios";
import { URL } from "../../url";
//scroll
import AOS from "aos";
import "aos/dist/aos.css";

const ProjectsAdmin = () => {
  const [projectPosts, setProjectPosts] = useState([]);
  const { status } = useParams(); // Get the status from the URL

  useEffect(() => {
    AOS.refresh(); // Refresh AOS on component mount/update
  }, []);

  useEffect(() => {
    const fetchProjectPosts = async () => {
      try {
        const response = await axios.get(`${URL}/api/projectposts`);
        // Filter the projects based on the status parameter
        const filteredProjects = response.data.filter((projectpost) => {
          if (status === "pending")
            return !projectpost.approved && !projectpost.rejected;
          if (status === "approved") return projectpost.approved;
          if (status === "rejected") return projectpost.rejected;
          return true;
        });
        setProjectPosts(filteredProjects);
      }catch (error) {
        console.error("Error fetching project posts:", error);
      }
    };

    fetchProjectPosts();
  }, [status]);

  const getStatusHeader = () => {
    switch (status) {
      case "pending":
        return "Pending approval projects";
      case "approved":
        return "Approved projects";
      case "rejected":
        return "Rejected projects";
      default:
        return "All Projects";
    }
  };

  const handleDelete = async (projectId) => {
    const confirmMessage = "Are you sure you want to delete this project?";
    const isConfirmed = window.confirm(confirmMessage);
  
    if (!isConfirmed) {
      return;
    }
  
    try {
      await axios.delete(`${URL}/api/projectposts/reject/${projectId}`);
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
      <div className="admin_content">
      <h1>{getStatusHeader()}</h1> <br></br>
        <table>
          <thead>
            <tr className="admin_tr">
              <th className="admin_th">Name</th>
              <th className="admin_th">Project Name</th>
              <th className="admin_th">Email</th>
              <th className="admin_th">Time</th>
              <th className="admin_th">Stauts</th>
              <th className="admin_th">View</th>
              {status === "rejected" && <th className="admin_th">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projectPosts.map((projectpost) => (
              <tr key={projectpost._id} className="admin_tr">
                <td className="admin_td">{projectpost.name}</td>
                <td className="admin_td">{projectpost.project_name}</td>
                <td className="admin_td">{projectpost.email}</td>
                {/*<td>{projectpost.createdAt}</td> */}
                <td className="admin_td">{new Date(projectpost.createdAt).toLocaleString()}</td>
                <td className="admin_td">
                  {projectpost.approved
                    ? "Approved" 
                    : projectpost.rejected
                    ? "Rejected"
                    : "Pending Approval"}
                </td>
                <td className="admin_td">
                  <Link
                    to={`/viewprojectadmin/${projectpost._id}?status=${status}`}
                  >
                   <button style={{borderRadius:"10px", color:"white", background:"rgb(95, 95, 228)", padding:"5px", cursor:"pointer"}}> See More </button>
                  </Link>
                </td>
            
                {status === "rejected" && (
                  <td className="admin_td">
                    <button
                      style={{ borderRadius: "10px", color: "white", background: "red", padding: "5px", cursor: "pointer" }}
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
      </div>
    </div>
  );
};

export default ProjectsAdmin;
