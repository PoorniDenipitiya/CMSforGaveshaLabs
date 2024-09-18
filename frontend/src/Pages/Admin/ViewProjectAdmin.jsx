
import React, { useState, useEffect, useRef } from "react";
import "./ViewProjectAdmin.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { URL } from "../../url";
//import { useLocation } from "react-router-dom";
import AdminNavi from "./AdminNavi";
import { useNavigate } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";

export const ViewProjectAdmin = () => {
  const { id } = useParams();
  
  const [projectPost, setProjectPost] = useState({});
  const navigate = useNavigate();
  const containerRef = useRef(null); // Reference to the container
  const wrapperRef = useRef(null); // Reference to the wrapper

  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    AOS.refreshHard(); // Refresh AOS on component mount/update
  }, [projectPost]);

  
  const fetchproPost = async () => {
    try {
      const res = await axios.get(`${URL}/api/projectposts/${id}`);

      setProjectPost(res.data);
    } catch (err) {
      console.log("Error fetching project post:", err);
    }
  };

  useEffect(() => {
    fetchproPost();
  }, [id]);

  const handleApproval = async (approvedStatus) => {
    if (approvedStatus) {
      const confirmMessage = `Are you sure you want to ${
        approvedStatus ? "approve" : "reject"
      } this project?`;
      const isConfirmed = window.confirm(confirmMessage);

      if (!isConfirmed) {
        return; // User clicked "Cancel", stop further execution
      }

      try {
        const url = `${URL}/api/projectposts/${
          approvedStatus ? "approve" : "reject"
        }/${id}`;
        await axios.put(url);
        await sendNotification(approvedStatus); // Send notification after approval
        // alert(`${approvedStatus ? "Approved" : "Rejected"} this project`);
        navigate("/admin");
      } catch (err) {
        console.log(err);
      }
    } else {
      setShowModal(true);
    }
  };

  const sendNotification = async (approvedStatus) => {
    try {
      const notification = {
        userId: projectPost.userId, // Assuming projectPost has userId
        message: `Your project has been ${
          approvedStatus ? "approved" : "rejected"
        }.`,
        read: false,
      };
      await axios.post(`${URL}/api/notifications`, notification);
    } catch (err) {
      console.log("Error sending notification:", err);
    }
  };

  


  const renderButtons = () => {
    if (!projectPost.approved && !projectPost.rejected) {
      return (
        <>
          <button
            type="submit"
            className="approved"
            onClick={() => handleApproval(true)}
          >
            Approve
          </button>
          <button
            type="submit"
            className="reject"
            onClick={() => handleApproval(false)}
          >
            Reject
          </button>
        </>
      );
    } else if (projectPost.approved) {
      return (
        <button
          type="submit"
          className="reject"
          onClick={() => handleApproval(false)}
        >
          Reject
        </button>
      );
    } else if (projectPost.rejected) {
      return (
        <button
          type="submit"
          className="approved"
          onClick={() => handleApproval(true)}
        >
          Approve
        </button>
      );
    }
  };

  // Use a unique key to ensure the video element is re-rendered
  const videoKey = projectPost.project_video + new Date().getTime();

  const handleReject = () => {
    setShowModal(true);
  };

 
  const submitRejection = async () => {
    try {
      const url = `${URL}/api/projectposts/reject/${id}`;
      await axios.put(url, { reason: rejectionReason });
      await sendNotification(false);
      setShowModal(false);
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <AdminNavi />
      <div className="admin_content">
        <div className="project_seemore_container" data-aos="fade-up">
          <h1 className="project_title">{projectPost.project_name}</h1>{" "}
          <br></br>
          <hr className="project_line"></hr> <br></br>
          <div className="project_inline_user">
            {/*  <div className="project_userprofile"></div>*/}
            <div className="project_user">
              <p>
                Published by{" "}
                <b>
                  <i>{projectPost.name}</i>
                </b>
              </p>
              <p className="project_mail">From {projectPost.email}</p>
              <p>
                On {new Date(projectPost.updatedAt).toString().slice(0, 15)}
              </p>
              <p>
                At {new Date(projectPost.updatedAt).toString().slice(16, 24)}
              </p>
            </div>
          </div>
          <br></br>
          <div className="project_image" data-aos="fade-up">
            <img src={projectPost.project_photo} alt="Avatar" width={600}></img>
            <p className="project_figure">Image of the project</p>
          </div>
          <br></br>
          <div data-aos="fade-up">
            <div className="project_head">
              Components required for this project are:
            </div>
            <br></br>
            <div className="project_describe">{projectPost.components}</div>
          </div>
          <br></br>
          <br></br>
          <div data-aos="fade-up">
            <p className="project_head">Objectives of this project:</p>{" "}
            <br></br>
            <p className="project_describe">{projectPost.objectives}</p>
          </div>
          <br></br>
          <br></br>
          
          <div className="project_head" data-aos="fade-up">
            Video explanation of the project
          </div>
          <br></br>
          <div className="project_video" data-aos="fade-up">
            <video key={videoKey} width="600" controls>
              <source src={projectPost.project_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* <p className="project_figure">Video explanation of the project</p> */}
          </div>
          <br></br>
          <div data-aos="fade-up">
            <p className="project_head">Explanation of the project:</p>
            <br></br>
            <p className="project_describe">{projectPost.explanation}</p>
          </div>
          <br></br>
          <br></br>
          
          <div className="project_head" data-aos="fade-up">
            Circuit Diagram
          </div>
          <br></br>
          <div className="project_image">
            <img
              src={projectPost.circuit_diagram}
              alt="Project Image"
              width={600}
            ></img>
            {/*  <p className="project_figure">Circuit Diagram</p> */}
          </div>
          <br></br>
          <div className="project_head" data-aos="fade-up">
            PCB Design
          </div>
          <br></br>
          <div className="project_image">
            <img
              src={projectPost.pcb_design}
              alt="Project Image"
              width={600}
            ></img>
            {/* <p className="project_figure">PCB Design</p>*/}
          </div>
          <br></br>
          <div data-aos="fade-up">
            <p className="project_head">
              Refer the code through this GitHub link:
            </p>
            <br></br>
            <a
              className="project_github"
              href={projectPost.git_link}
              // href="https://github.com/flesler/jquery.scrollTo.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              {projectPost.git_link}
            </a>
          </div>
          <br></br>
          <br></br>
          <div className="button_flex">{renderButtons()}</div>
          {showModal && (
            <div className="modal">
              <h2>Reason to reject</h2>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide the reason for rejection"
              />
              <button onClick={submitRejection}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          )}
          <br></br>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectAdmin;
