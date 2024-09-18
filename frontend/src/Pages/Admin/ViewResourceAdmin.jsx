import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../url";
import AdminNavi from "./AdminNavi";
import "./ViewProjectAdmin.css";
import ReactQuill from "react-quill"; // Import ReactQuill for rendering


const ViewResourceAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resoPost, setResoPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchResoPost = async () => {
    try {
      const response = await axios.get(`${URL}/api/resoposts/${id}`);
      setResoPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching resource post:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResoPost();
  }, [id]);

  const handleApproval = async (approvedStatus) => {
    if (!approvedStatus) {
      setShowModal(true);
      return;
    }
 
    const confirmMessage = `Are you sure you want to approve this resource?`;
    const isConfirmed = window.confirm(confirmMessage);
 
    if (!isConfirmed) {
      return; // User clicked "Cancel", stop further execution
    }
 
    try {
      const url = `${URL}/api/resoposts/${approvedStatus ? 'approve' : 'reject'}/${id}`;
      await axios.put(url, approvedStatus ? {} : { reason: rejectionReason });
      await sendNotification(approvedStatus);
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  const sendNotification = async (approvedStatus) => {
    try {
      const notification = {
        userId: resoPost.userId,
        message: `Your resource has been ${
          approvedStatus ? "approved" : "rejected"
        }.`,
        read: false,
      };
      await axios.post(`${URL}/api/notifications`, notification);
    } catch (err) {
      console.log("Error sending notification:", err);
    }
  };

  const renderButtons = () => {
    if (!resoPost.approved && !resoPost.rejected) {
      return (
        <>
          <button
            type="submit"
            className="approved"
            onClick={() => handleApproval(true)}
          >
            Approve
          </button>
          <button
            type="submit"
            className="reject"
            onClick={() => handleApproval(false)}
          >
            Reject
          </button>
        </>
      );
    } else if (resoPost.approved) {
      return (
        <button
          type="submit"
          className="reject"
          onClick={() => handleApproval(false)}
        >
          Reject
        </button>
      );
    } else if (resoPost.rejected) {
      return (
        <button
          type="submit"
          className="approved"
          onClick={() => handleApproval(true)}
        >
          Approve
        </button>
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!resoPost) {
    return <div>Error loading resource post</div>;
  }

  const handleReject = () => {
    setShowModal(true);
  };

  const submitRejection = async () => {
    try {
      const url = `${URL}/api/resoposts/reject/${id}`;
      await axios.put(url, { reason: rejectionReason });
      await sendNotification(false);
      setShowModal(false);
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <AdminNavi />
      <div className="admin_content">
        <div className="project_seemore_container" data-aos="fade-up">
          <h1 className="resource_title">{resoPost.title}</h1>
          <hr className="resource_line" />
          <br />
          <div className="resource_inline_user">
            <br />
            <div className="resopost-image" data-aos="fade-up">
            <p className="resource_figure">Image</p>
              <img src={resoPost.photo} alt={resoPost.title} width={600} />
            </div>
          </div>
          <br />
          <div data-aos="fade-up">
            <p className="resource_head">Explanation of the resource:</p>
            <br />
            <ReactQuill value={resoPost.desc} readOnly={true} theme="bubble" />
            </div>
          <br />
          <div>
            <p className="resource_head">Category:</p>
            <br />
            <div>
          {resoPost.categories?.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
          </div>
          <br />
          <div className="button_flex">{renderButtons()}</div>
          {showModal && (
            <div className="modal">
              <h2>Reason to reject</h2>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide the reason for rejection"
              />
              <button onClick={submitRejection}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewResourceAdmin;