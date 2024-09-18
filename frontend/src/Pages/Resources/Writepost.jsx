import React, { useState, useEffect } from "react";
import { URL } from "../../url";
import axios from "axios"; 
import "./Writepost.css";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { imageDb } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Alert from "../../Component/Alert/Alert";
import { useUsers } from "../../Context/UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS

const categoriesList = {
  "Sensors": [
    "All Categories",
    "Motion Sensors",
    "Temperature Sensors",
    "Light Sensors",
    "Proximity Sensors",
    "Gas Sensors",
    "Sound Sensors",
    "Image Sensors/Cameras",
    "Environmental Sensors",
    "Other sensors"
  ],
  "PCB (Printed Circuit Board)": [
    "All Categories",
    "Design Software",
    "Manufacturing Services",
    "Components Sourcing",
    "PCB Layout Techniques",
    "Assembly and Soldering",
    "Testing and Validation"
  ],
  "Communication Modules": [
    "All Categories",
    "Wi-Fi Modules",
    "Bluetooth Modules",
    "Zigbee Modules",
    "LoRa Modules",
    "Cellular Modules",
    "RFID and NFC Modules"
  ],
  "Microcontrollers": [
    "All Categories",
    "Popular Microcontroller Families (Arduino, ESP32, etc.)",
    "Development Environments (IDEs)",
    "Programming Microcontrollers",
    "Power Management for Microcontrollers",
    "Interfaces and Peripherals"
  ],
  "IoT Platforms and Cloud Services": [
    "All Categories",
    "IoT Platforms",
    "Cloud Storage Solutions",
    "Data Analytics",
    "Device Management",
    "Integration and APIs"
  ],
  "IoT Prototyping and Development Kits": [
    "All Categories",
    "Arduino Kits",
    "Raspberry Pi Kits",
    "ESP32 Development Kits",
    "Sensor Kits",
    "Wireless Communication Kits"
  ],
  "Others": [
    "All Categories",
    "Codes/Programming",
    "Power Management",
    "Prototyping Tools",
    "Enclosures and Cases",
    "Networking",
    "Wireless Communication",
    "Machine Learning and AI for IoT",
    "Others"
  ]
};

export const Writepost = () => {
  const [postedBy, setPostedBy] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [maincats, setMainCats] = useState(Object.keys(categoriesList)[0]);
  const [cats, setCats] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { user } = useUsers();
  const [agree, setAgree] = useState(false);
  
  useEffect(() => {
    if (user) {
      setPostedBy(user._id);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
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
    if (!title.trim() || !desc.trim() || cats.length === 0 || !file) {
      alert("All fields are required.");
      return;
    }
    if (!agree) {
      setAlertMessage("You must agree to the terms and conditions.");
      setShowAlert(true);
      return;
    }

    let photoUrl = null;

    if (file) {
      const imgRef = ref(imageDb, `resourcesimages/${v4()}`);
      try {
        await uploadBytes(imgRef, file);
        photoUrl = await getDownloadURL(imgRef);
      } catch (err) {
        console.log(err);
      }
    }

    const resoPost = {
      title,
      desc,
      maincategories: maincats,
      categories: cats,
      photo: photoUrl,
      postedBy: postedBy,
    };

    try {
      const res = await axios.post(`${URL}/api/resoposts/create`, resoPost, {
        withCredentials: true,
      });
      console.log(res.data);
      setAlertMessage("Your resource is submitted for Admin approval.");
      setShowAlert(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    if (alertMessage === "Your resource is submitted for Admin approval.") {
      navigate('/resources');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Share Your Knowledge...!</h1>

      <div className="resorestrict">
        <p>
          You can post resources related to IoT within the categories included in this website and upload 
          Data Sheets directly to the Data Sheets category. Please be mindful to post only standard information. 
          The admin will verify your post before it gets displayed on the website. Please check your email for 
          the verification email after posting.
        </p>
        <input
          type="checkbox"
          name="agree"
          id="agree"
          checked={agree}
          className="agree"
          onChange={(e) => setAgree(e.target.checked)}
          required
        />{" "}
        I agree
      </div>

      {showAlert && (
        <Alert
          message={alertMessage}
          onClose={handleAlertClose}
        />
      )}

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
            <select onChange={handleMainCategoryChange} className="main-category">
              <option value={maincats}>Main Category</option>
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
<h3>Cover Image:</h3>
        <input onChange={handlePhotoChange} type="file" className="file-input" />

        <ReactQuill
          value={desc}
          onChange={setDesc}
          className="description"
          placeholder="Enter Post Description"
          modules={{
            toolbar: [
              [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
              [{size: []}],
              ['bold', 'italic', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['link', 'image'],
              ['clean']
            ],
          }}
        />

        <button type="submit" className="publish-btn">
          Publish
        </button>
      </form>
    </div> 
  );
};

export default Writepost;
