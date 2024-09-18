import React, { useState } from "react";
import { useUsers } from "../../Context/UserContext";
import axios from "axios";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import { imageDb } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import editProfileImage from './Assets/editprofile.png'

const EditProfile = () => {
  const { user } = useUsers();
  const id = user._id;
  const [author, setAuthor] = useState(user);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    setLoading(true); // Set loading to true
    const storageRef = ref(imageDb, `profileImages/${uuidv4()}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log(url);
      setAuthor((prevState) => ({ ...prevState, profilePicture: url }));
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, author);
      alert("Profile updated successfully!");
      navigate('/home');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="editProfileMainDiv">
      {loading && (
        <div className="loadingOverlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="editProfileimg">
        <img src={editProfileImage} alt="" />
      </div>
      <div className="secondDivEditProfile">
        <h2 className="editProfilemainText">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={author.username}
              placeholder={user.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={author.email}
              placeholder={author.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="createBlogTextLabel"> Image: </label>
            <br />
            {author.profilePicture && (
              <img src={author.profilePicture} alt="Profile" className="blogImage" />
            )}
            <br />
            <input
              type="file"
              className="createBlogEnterImage"
              onChange={handleUpload}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;