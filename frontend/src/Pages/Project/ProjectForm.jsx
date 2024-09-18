import React, { useState, useEffect } from "react";
import "../../firebase.js";
import "./ProjectForm.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../Context/UserContext";
import { URL } from "../../url";
import { imageDb } from "../../firebase";
import Alert from "../../Component/Alert/Alert";
import AOS from "aos";
import "aos/dist/aos.css"; 

export const ProjectForm = () => {
  const { user } = useUsers();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project_name, setProjectName] = useState("");
  const [components, setComponents] = useState("");
  const [objectives, setObjectives] = useState("");
  const [intro, setIntro] = useState("");
  const [project_photo, setProjectPhoto] = useState(null);
  const [project_video, setProjectVideo] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [circuit_diagram, setCircuitDiagram] = useState(null);
  const [pcb_design, setPcbDesign] = useState(null);
  const [git_link, setGitLink] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    AOS.refresh(); // Refresh AOS on component mount/update
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleIntroChange = (e) => {
    const text = e.target.value;
    const words = text.split(/\s+/);
    const WORD_LIMIT = 30;
    if (words.length <= WORD_LIMIT) {
      setIntro(text);
      setFormErrors((prevErrors) => ({ ...prevErrors, intro: "" }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        intro: `Word limit exceeded. Maximum ${WORD_LIMIT} words allowed.`,
      }));
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const fileRef = ref(imageDb, `projectVideos/${uuidv4()}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    if (e.target.name === "project_photo") {
      setProjectPhoto(url);
    } else if (e.target.name === "project_video") {
      setProjectVideo(url);
    } else if (e.target.name === "circuit_diagram") {
      setCircuitDiagram(url);
    } else if (e.target.name === "pcb_design") {
      setPcbDesign(url);
    }
  };

  const handleVideoLinkChange = (e) => {
    setProjectVideo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmit(true);
      return;
    }
    setFormErrors({});
    setIsSubmit(false);
    const projectPost = {
      name,
      email,
      project_name,
      components,
      objectives,
      intro,
      project_photo,
      project_video,
      explanation,
      circuit_diagram,
      pcb_design,
      git_link,
      postedBy: user._id,
    };

    try {
      const res = await axios.post(
        `${URL}/api/projectposts/create`,
        projectPost,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setShowAlert(true);
    } catch (err) {
      console.error("Error submitting project:", err);
    }
  };
  const handleAdminalert = () =>{
    setShowAlert(false);
    navigate('/project')
  }

  const validateForm = async () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format";
    } else {
      const isEmailValid = await validateEmailWithHunter(email);
      if (!isEmailValid) {
        errors.email = "Email is not valid or deliverable";
      }
    }
    if (!project_name.trim()) {
      errors.project_name = "Project name is required";
    }
    if (!components.trim()) {
      errors.components = "Components are required";
    }
    if (!objectives.trim()) {
      errors.objectives = "Objectives are required";
    }
    if (!intro.trim()) {
      errors.intro = "Introduction is required";
    }
    if (!project_photo) {
      errors.project_photo = "Project photo is required";
    }
    if (!project_video) {
      errors.project_video = "Project video is required";
    }
    if (!explanation.trim()) {
      errors.explanation = "Explanation is required";
    }
    if (!circuit_diagram) {
      errors.circuit_diagram = "Circuit diagram is required";
    }
    if (!pcb_design) {
      errors.pcb_design = "PCB Design is required";
    }
    if (!git_link.trim()) {
      errors.git_link = "Git link is required";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const validateEmailWithHunter = async (email) => {
    const apiKey = '1390ced31cd81d4930ee925b145427b0d101c842';
    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

    try {
      const response = await axios.get(url);
      return response.data.data.result === 'deliverable';
    } catch (error) {
      console.error('Error validating email:', error);
      return false;
    }
  };

  return (
    <div className="project_container" data-aos="fade-up">
      <form onSubmit={handleSubmit}>
        <div className="project_form">
          <h2 className="project_topic">Fill in the details</h2>

          <div className="project_frame_box_center">
            <div className="project_fill">
              <div className="project_field">
                <label className="project_label">Name</label>
                <input
                  className="project_input"
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                />
              </div>
              {formErrors.name && (
                <p className="project_error">{formErrors.name}</p>
              )}

              <div className="project_field">
                <label className="project_label">E-mail address</label>
                <input
                  className="project_input"
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  name="email"
                  placeholder="E-mail"
                  value={email}
                />
              </div>
              {formErrors.email && (
                <p className="project_error">{formErrors.email}</p>
              )}

              <div className="project_field">
                <label className="project_label">Project name</label>
                <input
                  className="project_input"
                  onChange={(e) => setProjectName(e.target.value)}
                  type="text"
                  name="project_name"
                  placeholder="Project Name"
                />
              </div>
              {formErrors.project_name && (
                <p className="project_error">{formErrors.project_name}</p>
              )}

              <div className="project_field">
                <label className="project_label">
                  Used components and libraries
                </label>
                <textarea
                  className="project_input"
                  onChange={(e) => setComponents(e.target.value)}
                  name="components"
                  placeholder="Components ex: ATMega32, Rain sensor"
                  cols={100}
                  rows={2}
                />
              </div>
              {formErrors.components && (
                <p className="project_error">{formErrors.components}</p>
              )}

              <div className="project_field">
                <label className="project_label">Final goal / objectives</label>
                <textarea
                  className="project_input"
                  onChange={(e) => setObjectives(e.target.value)}
                  type="text"
                  name="objectives"
                  placeholder="Objectives"
                  cols={100}
                  rows={2}
                />
              </div>
              {formErrors.objectives && (
                <p className="project_error">{formErrors.objectives}</p>
              )}

              <div className="project_field">
                <label className="project_label">
                  Give a brief introduction about the project
                </label>
                <textarea
                  className="project_input"
                  onChange={handleIntroChange}
                  value={intro}
                  name="intro"
                  placeholder="Give a brief description about your project"
                  cols={100}
                  rows={2}
                />
              </div>
              {formErrors.intro && (
                <p className="project_error">{formErrors.intro}</p>
              )}

              <div className="project_upload">
                <label htmlFor="project_photo" className="project_label">
                  Upload a clear image of your project
                </label>
                <input
                  className="project_input"
                  onChange={(e) => handleUpload(e)}
                  type="file"
                  name="project_photo"
                  accept="image/*"
                />
              </div>
              {formErrors.project_photo && (
                <p className="project_error">{formErrors.project_photo}</p>
              )}

              <div className="project_upload">
                <label htmlFor="project_video" className="project_label">
                  Upload the video about the project
                </label>
                <input
                  className="project_input"
                  onChange={(e) => handleUpload(e)}
                  type="file"
                  name="project_video"
                  accept="video/*"
                />
              </div>
              {formErrors.project_video && (
                <p className="project_error">{formErrors.project_video}</p>
              )}

              <div className="project_field">
                <label className="project_label">
                  Explain your project descriptively
                </label>
                <textarea
                  className="project_input"
                  onChange={(e) => setExplanation(e.target.value)}
                  type="text"
                  name="explain"
                  placeholder="Give a full explanation of the project"
                  cols={100}
                  rows={4}
                />
              </div>
              {formErrors.explanation && (
                <p className="project_error">{formErrors.explanation}</p>
              )}

              <div className="project_upload">
                <label htmlFor="circuit_diagram" className="project_label">
                  Upload your circuit diagram
                </label>
                <input
                  className="project_input"
                  onChange={(e) => handleUpload(e)}
                  type="file"
                  name="circuit_diagram"
                  accept="image/*"
                />
              </div>
              {formErrors.circuit_diagram && (
                <p className="project_error">{formErrors.circuit_diagram}</p>
              )}

              <div className="project_upload">
                <label htmlFor="pcb_design" className="project_label">
                  Upload your PCB design
                </label>
                <input
                  className="project_input"
                  onChange={(e) => handleUpload(e)}
                  type="file"
                  name="pcb_design"
                  accept="image/*"
                />
              </div>
              {formErrors.pcb_design && (
                <p className="project_error">{formErrors.pcb_design}</p>
              )}

              <div className="project_field">
                <label className="project_label">
                  Link to the Git repository
                </label>
                <input
                  className="project_input"
                  onChange={(e) => setGitLink(e.target.value)}
                  type="text"
                  name="git_link"
                  placeholder="Put the GitHub link to here."
                  value={git_link}
                />
              </div>
              {formErrors.git_link && (
                <p className="project_error">{formErrors.git_link}</p>
              )}

              <button type="submit" className="project_form_submit">
                Submit
              </button>
              {showAlert && (
            <Alert
              message="Your project is submitted for Admin approval."
              onClose={handleAdminalert}
            />
          )}
              {isSubmit && Object.keys(formErrors).length > 0 && (
                <div className="project_ui_message_error">
                  Error: Please fill in all the required fields.
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;