import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { imageDb } from "../../firebase";
import { URL } from "../../url";
import "./Writepost.css";
import { ImCross } from "react-icons/im";

export const ResoEditpost = () => {
  const { id: resoPostId } = useParams(); // Get the resource post ID from URL params
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [title, setTitle] = useState(""); // State for post title
  const [desc, setDesc] = useState(""); // State for post description
  const [file, setFile] = useState(null); // State for image file
  const [cat, setCat] = useState(""); // State for category input
  const [cats, setCats] = useState([]); // State for categories

  useEffect(() => {
    // Fetch the resource post data when component mounts
    const fetchResoPost = async () => {
      try {
        const res = await axios.get(`${URL}/api/resoposts/${resoPostId}`); // Fetch post data by ID
        setTitle(res.data.title); // Set title state
        setDesc(res.data.desc); // Set description state
        setCats(res.data.categories); // Set categories state
        setFile(res.data.photo); // Set image file state
      } catch (err) {
        console.log(err); // Log error if fetching fails
      }
    };
    fetchResoPost(); // Invoke the fetchResoPost function
  }, [resoPostId]); // Execute effect only when resoPostId changes

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setFile(file); // Set file state
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (file) {
      const imgRef = ref(imageDb, `resourcesimages/${uuidv4()}`); // Create a reference for image upload in Firebase Storage
      try {
        await uploadBytes(imgRef, file); // Upload the file to Firebase Storage
        const downloadURL = await getDownloadURL(imgRef); // Get the download URL of the uploaded image

        const resoPost = {
          title,
          desc,
          categories: cats,
          photo: downloadURL, // Update post data including the new image URL
        };

        const res = await axios.put(
          `${URL}/api/resoposts/${resoPostId}`,
          resoPost,
          { withCredentials: true }
        ); // Update the resource post on the server
        console.log(res.data); // Log the response data
        navigate("/motionsen"); // Navigate to motionsen page after successful update
      } catch (err) {
        console.log(err); // Log error if updating fails
      }
    } else {
      console.log("No file selected"); // Log if no file is selected
    }
  };

  const deleteCategory = (i) => {
    const updatedCats = [...cats]; // Create a copy of categories array
    updatedCats.splice(i, 1); // Remove the category at index i
    setCats(updatedCats); // Update categories state
  };

  const addCategory = () => {
    const updatedCats = [...cats]; // Create a copy of categories array
    updatedCats.push(cat); // Add the new category to the array
    setCat(""); // Clear the category input
    setCats(updatedCats); // Update categories state
  };

  return (
    <div className="container">
      <h1 className="title">Update Your Post</h1> {/* Page title */}
      <form className="form">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          placeholder="Enter Post Title"
          className="resopostinput"
        />{" "}
        {/* Input field for post title */}
        <div className="reso-post-categories-container">
          <div className="reso-category-input">
            <input
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              type="text"
              placeholder="Enter Post Category"
              className="resoaddcategory"
            />{" "}
            {/* Input field for adding category */}
            <div onClick={addCategory} className="reso-add-button">
              Add
            </div>{" "}
            {/* Button to add category */}
          </div>
          <div className="reso-category-list">
            {/* Display categories */}
            {cats?.map((c, i) => (
              <div key={i} className="reso-category-item">
                <p>{c}</p> {/* Display category */}
                <p
                  onClick={() => deleteCategory(i)}
                  className="reso-delete-button"
                >
                  <ImCross />
                </p>{" "}
                {/* Button to delete category */}
              </div>
            ))}
          </div>
        </div>
        <input
          onChange={handlePhotoChange}
          type="file"
          className="file-input"
        />{" "}
        {/* File input for uploading image */}
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="description"
          placeholder="Enter Post Description"
          cols={30}
          rows={15}
        ></textarea>{" "}
        {/* Textarea for post description */}
        <button onClick={handleUpdate} className="publish-btn">
          {" "}
          {/* Button to update post */}
          Update
        </button>
      </form>
    </div>
  );
};
