
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AdminNavi from "./AdminNavi";
import "./ProjectsAdmin.css";
import axios from "axios";
import { URL } from "../../url";
import AOS from "aos";
import "aos/dist/aos.css";

const ResourcesAdmin = () => {
  const [resourcePosts, setResourcePosts] = useState([]);
  const { status } = useParams();

  useEffect(() => {
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchResourcePosts = async () => {
      try {
        const response = await axios.get(`${URL}/api/resoposts`);
        // Filter the projects based on the status parameter
        const filteredPosts = response.data.filter((resoPost) => {
          if (status === "pending")
            return !resoPost.approved && !resoPost.rejected;
          if (status === "approved") return resoPost.approved;
          if (status === "rejected") return resoPost.rejected;
          return true;
        });

        // Fetch user profiles for each resource post
        const postsWithUsers = await Promise.all(filteredPosts.map(async (resoPost) => {
          const userProfile = await fetchUserProfile(resoPost.postedBy);
          return { ...resoPost, user: userProfile };
        }));

        setResourcePosts(postsWithUsers);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResourcePosts();
  }, [status]);

  const fetchUserProfile = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
      return res.data; // Assuming res.data contains { username, email, ... }
    } catch (err) {
      console.error(`Error fetching user profile for user ${userId}:`, err);
      return null;
    }
  };

  const getStatusHeader = () => {
    switch (status) {
      case "pending":
        return "Pending Approval Resources";
      case "approved":
        return "Approved Resources";
      case "rejected":
        return "Rejected Resources";
      default:
        return "All Resources";
    }
  };

  const handleDelete = async (resoPostId) => {
    const confirmMessage = 'Are you sure you want to delete this resource post?';
    const isConfirmed = window.confirm(confirmMessage);
  
    if (!isConfirmed) {
      return;
    }
  
    try {
      await axios.delete(`${URL}/api/resoposts/${resoPostId}`);
      // Update state after successful deletion
      const updatedResourcePosts = resourcePosts.filter((post) => post._id !== resoPostId);
      setResourcePosts(updatedResourcePosts);
    } catch (error) {
      console.error('Error deleting resource post:', error);
      // Add console log for specific error response if needed
      console.error('Error response data:', error.response?.data);
      // Add console log for status code if needed
      console.error('Error status code:', error.response?.status);
      // Add any other relevant error logging here
    }
  };
  

  return (
    <div data-aos="fade-up">
      <AdminNavi />
      <div className="admin_content">
        <h1>{getStatusHeader()}</h1>
        <br />
        <table>
          <thead>
            <tr className="admin_tr">
              <th className="admin_th">Title</th>
              <th className="admin_th">Posted By</th>
              <th className="admin_th">Email</th>
              <th className="admin_th">Time</th>
              <th className="admin_th">Status</th>
              <th className="admin_th">View</th>
              {status === "rejected" && <th className="admin_th">Actions</th>}

            </tr>
          </thead>
          <tbody>
            {resourcePosts.map((resoPost) => (
              <tr key={resoPost._id} className="admin_tr">
                <td className="admin_td">{resoPost.title}</td>
                <td className="admin_td">{resoPost.user ? resoPost.user.username : "Unknown"}</td>
                <td className="admin_td">{resoPost.user ? resoPost.user.email : "N/A"}</td>
                <td className="admin_td">{new Date(resoPost.createdAt).toLocaleString()}</td>
                <td className="admin_td">
                  {resoPost.approved ? "Approved" : resoPost.rejected ? "Rejected" : "Pending Approval"}
                </td>
                <td className="admin_td">
                  <Link to={`/viewresourceadmin/${resoPost._id}?status=${status}`}>
                    <button style={{borderRadius:"10px", color:"white", background:"rgb(95, 95, 228)", padding:"5px", cursor:"pointer"}}> See More </button>
                  </Link>
                </td>

                {status === "rejected" && (
                  <td className="admin_td">
                    <button
                      style={{ borderRadius: "10px", color: "white", background: "red", padding: "5px", cursor: "pointer" }}
                      onClick={() => handleDelete(resoPost._id)}
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

export default ResourcesAdmin;
