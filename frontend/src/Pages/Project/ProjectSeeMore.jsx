import React, { useState, useRef } from "react";
import "./ProjectSeeMore.css";
import axios from "axios";
import { Link, useParams,useNavigate, useLocation } from "react-router-dom";import { useEffect } from "react";
import { URL } from "../../url";
import ProjectCard from "./ProjectCard";
// import { Element, scroller } from 'react-scroll';
// import ScrollAnimation from "react-animate-on-scroll";
// import "animate.css/animate.min.css";
import { useUsers } from "../../Context/UserContext";
import { ProjectComment } from "./ProjectComment";
import Alert from "../../Component/Alert/Alert";
import AOS from "aos";
import "aos/dist/aos.css";

export const ProjectSeeMore = () => {
  const { id } = useParams();
  const [projectpost, setProjectPost] = useState({});
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [page, setPage] = useState(1); // State to keep track of the current page
  const containerRef = useRef(null); // Reference to the container
  const wrapperRef = useRef(null); // Reference to the wrapper
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useUsers();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.refreshHard(); // Refresh AOS on component mount/update
  }, [projectpost]);

  const fetchProPost = async () => {
    try {
      const res = await axios.get(`${URL}/api/projectposts/${id}`);
      setProjectPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRelatedProjects = async (page) => {
    try {
      if (projectpost.name) {
        const res = await axios.get(
          `${URL}/api/projectposts?name=${projectpost.name}&status=approved&page=${page}`
        );
        setRelatedProjects((prevProjects) => [
          ...prevProjects,
          ...res.data.filter((project) => project._id !== id),
        ]); // Append new projects to the existing list
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProPost();
  }, [id]);

  useEffect(() => {
    if (projectpost.name) {
      setRelatedProjects([]); // Reset related projects when a new project is loaded
      setPage(1); // Reset page to 1
      fetchRelatedProjects(1); // Fetch the first page of related projects
    }
  }, [projectpost.name]);

  const handleScroll = () => {
    if (
      containerRef.current.scrollLeft + containerRef.current.clientWidth >=
      containerRef.current.scrollWidth
    ) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchRelatedProjects(page); // Fetch related projects for the next page
    }
  }, [page]);

  // Event handlers to pause and resume the scrolling animation
  const handleMouseEnter = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add("paused");
    }
  };

  const handleMouseLeave = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("paused");
    }
  };

  // Use a unique key to ensure the video element is re-rendered
  const videoKey = projectpost.project_video + new Date().getTime();
  const filteredProjects = relatedProjects.filter(
    (project) => project.name === projectpost.name && project.approved
  );

  const fetchProjectComments = async () => {
    try {
      const res = await axios.get(`${URL}/api/projectComments/post/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching blog comments:", err);
    }
  };

  useEffect(() => {
    fetchProPost();
    fetchProjectComments();
  }, [id]);

  const postComment = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await axios.post(
          `${URL}/api/projectComments/create`,
          { comment, postId: id, postedBy: user._id },
          { withCredentials: true }
        );
        fetchProjectComments();
        setComment("");
      } catch (err) {
        console.error("Error posting comment:", err);
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    const scrollPosition = window.scrollY;
    setShowAlert(false);
    navigate("/login", { state: {  from: location, scrollPosition } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      postComment(e);
    }
  };

  return (
    <div className="project_seemore_container" data-aos="fade-up">
      <h1 className="project_title">{projectpost.project_name}</h1> <br></br>
      <hr className="project_line"></hr> <br></br>
      <div className="project_inline_user">
        {/*  <div className="project_userprofile"></div>*/}
        <div className="project_user">
          <p>
            Published by{" "}
            <b>
              <i>{projectpost.name}</i>
            </b>
          </p>
          <p className="project_mail">From {projectpost.email}</p>
          <p>On {new Date(projectpost.updatedAt).toString().slice(0, 15)}</p>
          <p>At {new Date(projectpost.updatedAt).toString().slice(16, 24)}</p>
        </div>
      </div>
      <br></br>
      <div className="project_image" data-aos="fade-up">
        <img src={projectpost.project_photo} alt="Avatar" width={600}></img>
        <p className="project_figure">Final output of the project</p>
      </div>
      <br></br>
      <div data-aos="fade-up">
        <div className="project_head">
          Components required for this project are:
        </div>
        <br></br>
        <div className="project_describe">{projectpost.components}</div>
      </div>
      <br></br>
      <br></br>
      <div data-aos="fade-up">
        <p className="project_head">Objectives of this project:</p> <br></br>
        <p className="project_describe">{projectpost.objectives}</p>
      </div>
      <br></br>
      <br></br>
      {/*  <div className="project_image">
        

        <Link to={projectpost.project_video}>click mee</Link> 

        <p className="project_figure">Video explanation of the project</p>
      </div> */}
      <div className="project_head" data-aos="fade-up">
        Video explanation of the project
      </div>
      <br></br>
      <div className="project_video" data-aos="fade-up">
        <video key={videoKey} width="600" controls>
          <source src={projectpost.project_video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* <p className="project_figure">Video explanation of the project</p> */}
      </div>
      <br></br>

      <div data-aos="fade-up">
        <p className="project_head">Explanation of the project:</p>
        <br></br>
        <p className="project_describe">{projectpost.explanation}</p>
      </div>
      <br></br>
      <br></br>

      <div className="project_head" data-aos="fade-up">
        Circuit Diagram
      </div>
      <br></br>
      <div className="project_image">
        <img
          src={projectpost.circuit_diagram}
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
        <img src={projectpost.pcb_design} alt="Project Image" width={600}></img>
        {/* <p className="project_figure">PCB Design</p>*/}
      </div>
      <br></br>
      
      <div data-aos="fade-up">
        <p className="project_head">Refer the code through this GitHub link:</p>
        <br></br>
        <a
          className="project_github"
          href={projectpost.git_link}
          // href="https://github.com/flesler/jquery.scrollTo.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          {projectpost.git_link}
        </a>
      </div>
      <br></br>
      <br></br>


            {/* Project comments section */}
              <div className="ProjectComments" data-aos="fade-up">
        <div className="projectCommentTitle"> Comments</div>
        <div className="insideProjectComment">
          <div className="flex flex-col space-y-5">
            <input
              type="text"
              placeholder="Enter Your Thoughts !"
              className="ProjectCommentTextArea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
          </div>
          {showAlert && (
            <Alert
              message="Please login to comment"
              onClose={handleAlertClose}
            />
          )}
        </div>
        <div className="blog-comments-section">
  {Array.isArray(comments) && comments.length > 0 ? (
    comments.map((c) => (
      <ProjectComment key={c._id} c={c} fetchProjectComments={fetchProjectComments} />
    ))
  ) : (
    <p>No comments to display.</p>
  )}
</div>
      </div>
      <hr className="project_line" data-aos="fade-up"></hr>
      {relatedProjects.length > 0 ? (
        <div
          className="related_projects_section"
          ref={containerRef}
          onScroll={handleScroll}
        >
          <br></br>
          <p className="project_head" data-aos="fade-up">
            Related Projects by {projectpost.name}
          </p>
          <br></br>
          <div
            className="related_projects_wrapper"
            ref={wrapperRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="related_projects_grid">
            {filteredProjects.map((project) => (
                <div className="related_project_item" key={project._id}>
                  <ProjectCard projectpost={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No related projects to see.</p>
      )}
    </div>
  );
};

export default ProjectSeeMore;