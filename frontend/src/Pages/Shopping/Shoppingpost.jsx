import React, { useState, useEffect } from "react";
import "./Shoppingpost.css";
import axios from "axios";
import "firebase/storage";
import { imageDb } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../Context/UserContext";
import Alert from "../../Component/Alert/Alert";

export const Shoppingpost = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { user } = useUsers();
  const [postedBy, setPostedBy] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState({ contact: "", email: "" });
  const [agree, setAgree] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user) {
      setPostedBy(user._id);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoURL(URL.createObjectURL(file));
    setImage(file);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Handling specific validations based on input name
    if (name === "contact") {
      const NumberPattern = /^[0-9]{10}$/;
      if (!NumberPattern.test(value)) {
        setError(prevError => ({ ...prevError, contact: "Please enter a valid 10-digit phone number" }));
      } else {
        setError(prevError => ({ ...prevError, contact: "" }));
      }
    }

    if (name === "userEmail") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!isValidEmail.test(value)) {
        setError(prevError => ({ ...prevError, email: "Please enter a valid email address" }));
      } else {
        setError(prevError => ({ ...prevError, email: "" }));
      }
    }

    // Handling "price" input specifically for "Rs." prefix
    if (name === "price") {
      if (!value.startsWith("Rs.")) {
        setPrice("Rs." + value);  // Add "Rs." prefix and update state
      } else {
        setPrice(value);  // Update state with the current value (already prefixed)
      }
    } else {
      // For other input fields, update state normally
      if (name === "name") setName(value);
      if (name === "description") setDescription(value);
      if (name === "contact") setContact(value);
      if (name === "userEmail") setUserEmail(value);
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    
    if (!name || !description || !price || !contact || !photo || !userEmail || !agree) {
      setFormError("All fields are required.");
      return;
    }

    if (error.contact || error.email) {
      alert("Please correct the errors before submitting.");
      return;
    }

    setFormError("");  // Clear any previous error message

    const imgRef = ref(imageDb, `shoppingimages/${v4()}`);
    let downloadURL = "";

    try {
      await uploadBytes(imgRef, image);
      downloadURL = await getDownloadURL(imgRef);
      console.log("Download URL:", downloadURL);
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
    }

    const newShoppost = {
      name,
      description,
      price,
      contact,
      imageUrl: downloadURL,
      userEmail,
      postedBy,
    };

    try {
      const response = await axios.post("http://localhost:5000/create", newShoppost);
      console.log("Shop post created:", response.data);
      navigate("/shopping");
    } catch (error) {
      console.error("Error creating shop post:", error);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="adpost">
      <h1>Create your advertisement</h1>
      <div className="shopbody">
        <form className="shoppingform" method="post">
          <div className="restrict">
            <p>
              This website or the company will not be responsible for the
              business users do using this website. Users are strictly advised
              not to publish any advertisements that are not convenient for this
              website. Users must only add advertisements related to electronic
              and IoT topics. After selling your goods be kind enough to remove
              the advertisements.
            </p>
            <input
              type="checkbox"
              name="agree"
              id="agree"
              className="agree"
              onChange={(e) => setAgree(e.target.checked)}
              required
            />{" "}
            I agree
          </div>
          {showAlert && (
            <Alert
              message="You must agree to the terms and conditions."
              onClose={handleAlertClose}
            />
          )}
          {formError && <p style={{ color: "red" }}>{formError}</p>}
          <table className="shoptable">
            <tbody>
              <tr className="shoprow">
                <th>Add a photo</th>
                <td>
                  <input
                    type="file"
                    onChange={handlePhotoChange}
                    style={{ border: "none" }}
                    required
                  />
                </td>
              </tr>
              <tr className="shoprow">
                <th>Component Name</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter the component name with correct spellings"
                    required
                  />
                </td>
              </tr>
              <tr className="shoprow">
                <th>Price</th>
                <td>
                  <input
                    type="text"
                    name="price"
                    value={price}
                    onChange={handleChange}
                    placeholder="Rs."
                    required
                  />
                </td>
              </tr>
              <tr className="shoprow">
                <th>Description</th>
                <td>
                  <textarea
                    name="description"
                    value={description}
                    onChange={handleChange}
                    cols={50}
                    rows={18}
                    placeholder="Write a description about the component you wish to sell. Include all the necessary details including any constraints"
                    required
                  />
                </td>
              </tr>
              <tr className="shoprow">
                <th>Contact Number</th>
                <td>
                  <input
                    type="text"
                    name="contact"
                    value={contact}
                    onChange={handleChange}
                    placeholder="Enter a contact number containing 10 digits"
                    required
                  />
                  {error.contact && <span style={{ color: "red" }}>{error.contact}</span>}
                </td>
              </tr>
              <tr className="shoprow">
                <th>User Email</th>
                <td>
                  <input
                    type="email"
                    name="userEmail"
                    value={userEmail}
                    onChange={handleChange}
                    placeholder="This email will be used for communication purpose"
                    required
                  />
                  {error.email && <span style={{ color: "red" }}>{error.email}</span>}
                </td>
              </tr>
            </tbody>
          </table>
          <button className="shopbutton" type="submit" onClick={handleClick}>
            Add
          </button>
        </form>
        <table className="shoptable2">
          <tbody>
            <tr className="shoppostup">
              <td className="shopphoto">
                {photoURL ? <img src={photoURL} alt="Selected" /> : ""}{" "}
              </td>
              <td className="shoptext">
                <tr className="comname">{name}</tr>
                <tr className="comprice">{price}</tr>
              </td>
            </tr>
            <hr style={{ color: "black" }} />
            <div className="shoppostdown">
              <tr className="comdesc" style={{ fontSize: "18px", textAlign: "justify" }}>
                <td>{description}</td>
              </tr>
              <hr style={{ color: "black" }} />
              <tr className="concontact" style={{ fontSize: "18px", color: "purple" }}>
                <td>Contact for more information: {contact}</td>
              </tr>
            </div>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shoppingpost;