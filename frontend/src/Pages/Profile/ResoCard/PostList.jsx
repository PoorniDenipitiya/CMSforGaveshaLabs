import React from "react";
import ResoCard from "./ResoCard";
import Datasheetcard from "./DatasheetCard";
import "../../Resources/Sensors/Sensors.css";
import "../MySaves.css";

const PostList = ({ posts, onDelete }) => {
  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map((post) => {
          if (post.photo && post.desc) {
            return (
              <ResoCard key={post._id} resoPost={post} onDelete={onDelete} />
            );
          } else if (post.pdf) {
            return <Datasheetcard key={post._id} resoPost={post} onDelete={onDelete}/>;
          } else {
            return <p key={post._id}>Unknown post type</p>;
          }
        })
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;