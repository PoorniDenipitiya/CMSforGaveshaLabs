import React, { useState, useEffect } from "react";
import { URL } from "../../../../url";
import axios from "axios";
import "./../../Writepost.css";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { imageDb } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useUsers } from "../../../../Context/UserContext";
import 'react-quill/dist/quill.snow.css';

const categoriesList = {
  "Data Sheets": [
    "Sensor Data Sheets",
    "Microcontroller Data Sheets",
    "Communication Module Data Sheets",
    "Power Management IC Data Sheets",
    "Component Specifications",
  ],
};

export const DataSheetWrite = () => {
  const [postedBy, setPostedBy] = useState("");
  const [title, setTitle] = useState("");
  const [maincats, setMainCats] = useState(Object.keys(categoriesList)[0]);
  const [cats, setCats] = useState([]);
  const [pdfFile, setPdfFile] = useState(null); // State for PDF file
  const navigate = useNavigate();
  const { user } = useUsers();
  const [agree, setAgree] = useState(false); // Add state for the "I agree" checkbox


  useEffect(() => {
    if (user) {
      setPostedBy(user._id);
    }
  }, [user]);

  const handlePdfChange = (e) => {
    const pdfFile = e.target.files[0];
    setPdfFile(pdfFile);
  };

  const handleMainCategoryChange = (e) => {
    const selectedMainCategory = e.target.value;
    setMainCats(selectedMainCategory);
    setCats([]); // Clear subcategories when main category changes
  };

  const handleCategoryChange = (e) => {
    addCategory(e);
  };

  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i, 1);
    setCats(updatedCats);
  };

  const addCategory = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory && !cats.includes(selectedCategory) && selectedCategory !== "All Categories") {
      setCats([...cats, selectedCategory]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!title.trim() || cats.length === 0 || !pdfFile) {
      alert("All fields are required.");
      return;
    }   
  
    // Validate "I agree" checkbox
    if (!agree) {
      alert("You need to agree to the terms before submitting.");
      return;
    }

    let pdfUrl = null;
  
    if (pdfFile) {
      const pdfRef = ref(imageDb, `resourcespdfs/${v4()}`);
      try {
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      } catch (err) {
        console.log(err);
      }
    }
  
    const resoPost = {
      title,
      maincategories: maincats,
      categories: cats,
      pdf: pdfUrl,
      postedBy: postedBy,
    };
  
    try {
      const res = await axios.post(`${URL}/api/resoposts/create`, resoPost, {
        withCredentials: true,
      });
      console.log(res.data);
      alert("Your data sheet has been submitted successfully");
      navigate("/datasheet");
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="container">
      <h1 className="title">Share Your Knowledge...!</h1>

      <div className="resorestrict">
        <p>
          You can upload Data Sheets directly using this form. Please be mindful to post only standard information. 
          The admin will verify your post before it gets displayed on the website. Please check your email for 
          the verification email after posting.
        </p>
        <input
          type="checkbox"
          name="agree"
          id=""
          className="agree"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)} // Handle checkbox change
        />{" "}
        I agree
      </div>

      <form onSubmit={handleSubmit} className="form">
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter Post Title"
          className="resopostinput"
          value={title}
        />

        <div className="reso-post-categories-container">
          <div className="reso-category-input">
            <select onChange={handleMainCategoryChange} className="main-category" value={maincats}>
              {Object.keys(categoriesList).map((maincategory) => (
                <option key={maincategory} value={maincategory}>
                  {maincategory}
                </option>
              ))}
            </select>

            <select onChange={handleCategoryChange} className="resoaddcategory">
              <option value="">Sub Category</option>
              {categoriesList[maincats].map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="reso-category-list">
            {cats.map((c, i) => (
              <div key={i} className="reso-category-item">
                <p>{c}</p>
                <p onClick={() => deleteCategory(i)} className="reso-delete-button">
                  <ImCross />
                </p>
              </div>
            ))}
          </div>
        </div>

        <h3>Upload data sheet pdf:</h3>
        <input onChange={handlePdfChange} type="file" accept="application/pdf" className="file-input" />

        <button type="submit" className="publish-btn">
          Publish
        </button>
      </form>
    </div>
  );
};

export default DataSheetWrite;