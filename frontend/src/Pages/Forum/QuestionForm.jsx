import React, { useState, useEffect } from 'react';
import './QuestionForm.css';
import axios from 'axios';
import { imageDb } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../Context/UserContext';
import Alert from "../../Component/Alert/Alert";

const QuestionForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [viewCount] = useState(0);
  const { user } = useUsers();
  const [postedBy, setPostedBy] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (user) {
      setPostedBy(user._id);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate title and description
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.");
      return;
    }

    try {
      let downloadURL = "";

      if (file) {
        const imgRef = ref(imageDb, `questionImage/${v4()}`);
        await uploadBytes(imgRef, file);
        downloadURL = await getDownloadURL(imgRef);
        console.log("Download URL:", downloadURL);
      }

      const newQuestion = {
        title,
        description,
        viewCount,
        date: new Date().toISOString(),
        postedBy,
      };

      if (downloadURL) {
        newQuestion.imageUrl = downloadURL;
      }

      const res = await axios.post("http://localhost:5000/api/questions/create", newQuestion, {
        withCredentials: true,
      });
      console.log(res.data);
      setShowAlert(true);
      
    } catch (err) {
      console.error("Error submitting question:", err);
    }
  };
  const handlesuccessAlert = () =>{
    setShowAlert(false);
    navigate("/forum");
  }

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <div className='questionForm'>
      <h1>Ask Your Question</h1>
      <div className='formBody'>
        <form className='forumform' onSubmit={handleSubmit}>
          <table className='forumTable'>
            <thead>
              <tr>
                <td>
                  <input
                    type='text'
                    name='title'
                    value={title}
                    placeholder='Enter Your Question Title'
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "615px", height: "50px", marginTop: "10px", border: "none", padding: "5px" }}
                    required
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <textarea
                    name='description'
                    value={description}
                    cols={80}
                    rows={25}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Write Your Question'
                    style={{ padding: "5px" }}
                    required
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td>
                  <input type='file' onChange={handlePhotoChange} />
                </td>
              </tr>
            </tbody>
          </table>
          <button className='formsubmitbutton' type='submit' style={{ marginLeft: '600px' }}>Add Question</button>
          {showAlert && (
            <Alert
              message="Your question is posted successfully."
              onClose={handlesuccessAlert} 
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
