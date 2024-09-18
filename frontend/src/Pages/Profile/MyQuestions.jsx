import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard/QuestionCard";
import "./MyQuestions.css"
import axios from "axios";
import { useUsers } from "../../Context/UserContext";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";

const MyQuestions = () => {
  const [myQuestions, setMyQuestions] = useState([]);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const { user } = useUsers();

  useEffect(() => {
    const fetchForumQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/questions/user/${user._id}`
        );
        console.log("Fetched questions:", res.data); // Log data
        setMyQuestions(res.data);
      } catch (err) {
        console.error("Error fetching forum questions:", err);
      }
    };
    if (user) {
      fetchForumQuestions();
    }
  }, [user]);

  if (!user) {
    return <div className="user-not-found">User data not found!</div>;
  }

  const handleQuestionDelete = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${questionId}`);
      setMyQuestions((prevquestion) => prevquestion.filter((question) => question._id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const handleToggleQuestionGrid = () => {
    setShowQuestionGrid(!showQuestionGrid);
  };

  return (
    <div className="my-questions-body">
      <div className="UserDetailsDiv">
        <div className="UserInfo">
          {user && (
            <>
              <p className="UserName">{user.username}</p>
              <p className="UserEmail">Email: {user.email}</p>
            </>
          )}
        </div>
        <div className="UserProfilePicture">
          {user && (
            <img
              src={user.profilePicture}
              alt={`${user.username}`}
              className="UserImage"
            />
          )}
        </div>
      </div>

      <div className="my-questions-list">
        <div className="my-questions-header">
          <div className="questions-title">
            My Forum Questions
            <button onClick={handleToggleQuestionGrid} className="toggle-button">
              {showQuestionGrid ? (
                <CIcon
                  icon={icon.cilCaretTop}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdown-icon"
                />
              ) : (
                <CIcon
                  icon={icon.cilCaretBottom}
                  size=""
                  style={{ "--ci-primary-color": "black" }}
                  className="dropdown-icon"
                />
              )}
            </button>
          </div>
          <p className="questions-count">
            No of Forum Questions: {myQuestions.length}
          </p>
        </div>

        {myQuestions.length === 0 ? (
          <p className="no-questions">No saved questions found.</p>
        ) : (
          <ul className="questions-list">
            {showQuestionGrid
              ? myQuestions.map((question) => (
                
                  <QuestionCard
                    style={{ textDecoration: "none" }}
                    key={question._id}
                    question={question}
                    onDelete={handleQuestionDelete}
                  />
                ))
              : myQuestions.slice(0, 3).map((question) => (
                  <QuestionCard
                    style={{ textDecoration: "none" }}
                    key={question._id}
                    question={question}
                    onDelete={handleQuestionDelete}
                  />
                ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyQuestions;