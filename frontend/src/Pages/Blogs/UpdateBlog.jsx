import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { imageDb } from "../../firebase";
import { v4 as uuidv4 } from "uuid"; 
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const UpdateBlog = () => {
  const { id } = useParams(); 
  const [blogPost, setBlogPost] = useState({
    id: id,
    title: "",
    description: "",
    image: "",
  });
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogPosts/${id}`);
        setBlogPost({
          id: id,
          title: res.data.title,
          description: res.data.desc,
          image: res.data.image,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id]);

  // Function to handle image upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    setLoading(true); // Set loading to true
    const storageRef = ref(imageDb, `blogImages/${uuidv4()}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      setBlogPost((prevState) => ({ ...prevState, photo: url }));
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const confirmation = window.confirm(
      "Are you sure you want to update the post?"
    );
    if (confirmation) {
      axios
        .put(`http://localhost:5000/api/blogPosts/${id}`, blogPost)
        .then((res) => {
          navigate(`/InsidePost/${id}`);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div>
      <div className="createBlog">
        <div className="CreateBlogInnerdiv">
          <h1 className="createBlogTitle"> Update Blog Post </h1>

          {loading && (
            <div className="loadingOverlay">
              <div className="spinner"></div>
            </div>
          )}

          <form className="createBlogFormBody" onSubmit={handleSubmit}>
            <label className="createBlogTextLabel"> Title: </label>
            <br />
            <input
              type="text"
              placeholder="Enter Title"
              className="createBlogTextbox"
              value={blogPost.title}
              onChange={(e) =>
                setBlogPost({ ...blogPost, title: e.target.value })
              }
              required
            />
            <br />
            <label className="createBlogTextLabel"> Image: </label>
            <br />
            <br />
            {blogPost.image && (
              <img
                src={blogPost.photo}
                alt="Blog Image"
                className="blogImage"
              />
            )}
            <br />
            <input
              type="file"
              className="createBlogEnterImage"
              onChange={handleUpload}
            />

            <br />
            <label className="createBlogTextLabel"> Blog Body: </label>
            <br />
            <ReactQuill
              value={blogPost.description}
              onChange={(value) =>
                setBlogPost({ ...blogPost, description: value })
              }
              className="createBlogTextArea"
              placeholder="Enter Post Description"
              required
            />
            <br />
            <button type="submit" className="createBlogSubmit">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;