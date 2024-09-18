import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AuthorPage.css";
import Blogspost from "./Blogspost";
import "./Blog.css";

const AuthorPage = () => {
    const authorId = useParams().id;
    const [author, setAuthor] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);
    console.log(authorId);

    // Fetch the author's blog posts
    const fetchAuthPosts = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/blogPosts/user/${authorId}`
            );
            setBlogPosts(res.data);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
        }
    };

    // Fetch the author's details
    const fetchUserData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/auth/details/${authorId}`
            );
            setAuthor(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        if (authorId) {
            fetchUserData();
            fetchAuthPosts();
        }
    }, [authorId]);

    return (
        <div className="AuthorPage">
            <div className="AuthorDetailsDiv">
                <div className="AuthorInfo">
                    {author ? (
                        <>
                            <p className="AuthorName">{author.username}</p>
                            <p className="AuthorEmail">Email: {author.email}</p>
                            <p className="AuthorBlogsCount">No. of Blogs: {blogPosts.length}</p>
                        </>
                    ) : (
                        <p>Loading author details...</p>
                    )}
                </div>
                <div className="AuthorProfilePicture">
                    {author && (
                        <img src={author.profilePicture} alt={`${author.username}`} className="AuthorImage" style={{ height: '80px', width: '80px', borderRadius: '50%' }}/>
                    )}
                </div>
            </div>
            <div className="bpost">
                {blogPosts.map((blogPost) => (
                    <Blogspost
                        key={blogPost._id}
                        blogPost={blogPost}
                    />
                ))}
            </div>
        </div>
    );
};

export default AuthorPage;