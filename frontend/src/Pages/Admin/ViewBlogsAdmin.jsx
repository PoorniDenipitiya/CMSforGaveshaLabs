
import React, { useEffect, useState } from "react";
import "./ViewProjectAdmin.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { URL } from "../../url"; // Update the import to match your project structure
import AdminNavi from "./AdminNavi";
import { useNavigate } from "react-router-dom";

export const ViewBlogsAdmin = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState({});
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${URL}/api/blogPosts/${id}`);
        setBlogPost(res.data);
        fetchAuthor(res.data.postedBy);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAuthor = async (userId) => {
      try {
        const response = await fetch(`${URL}/api/auth/details/${userId}`);
        const userData = await response.json();
        setAuthor(userData);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchPost();
  }, [id]);

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = blogPost.videoURL
    ? getYoutubeVideoId(blogPost.videoURL)
    : null;

  return (
    <div>
      <AdminNavi />
      <div className="admin_content">
        <div className="project_seemore_container">
          <h1 className="project_title">{blogPost.title}</h1>
          <hr className="project_line" />
          <div className="project_inline_user">
            <div className="project_user">
              {author && (
                <>
                  <p>
                    Published by{" "}
                    <b>
                      <i>{author.username}</i>
                    </b>
                  </p>
                  <p className="project_mail">From {author.email}</p>
                  <p>
                    On {new Date(blogPost.createdAt).toString().slice(0, 15)}
                  </p>
                  <p>
                    At {new Date(blogPost.createdAt).toString().slice(16, 24)}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="project_image">
            <img src={blogPost.photo} alt="Blog Post" width={600} />
            <p className="project_figure">Image related to the blog post</p>
          </div>
<br></br>
          <div>
            <div className="project_head">Blog Content:</div>
            <div
              className="project_describe"
              dangerouslySetInnerHTML={{ __html: blogPost.desc }}
            />
          </div>
<br></br>
          <div>
            <div className="project_head">Video:</div>
            {videoId && (
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlogsAdmin;
