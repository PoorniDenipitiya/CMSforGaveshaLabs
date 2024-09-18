import { useEffect } from "react";
import axios from "axios";
import { URL } from "../../url";

const PostCounts = ({ setProjectCounts, setResourceCounts }) => {
  useEffect(() => {
    const fetchProjectPosts = async () => {
      try {
        const response = await axios.get(`${URL}/api/projectposts`);
        const posts = response.data;
        const counts = {
          pending: posts.filter((post) => !post.approved && !post.rejected)
            .length,
          approved: posts.filter((post) => post.approved).length,
          rejected: posts.filter((post) => post.rejected).length,
        };
        setProjectCounts(counts);
      } catch (error) {
        console.error("Error fetching project posts:", error);
      }
    };

  
  const fetchResoPosts = async () => {
    try {
      const response = await axios.get(`${URL}/api/resoposts`);
      const resoposts = response.data;
      const counts = {
        pending: resoposts.filter(
          (post) => !post.approved && !post.rejected
        ).length,
        approved: resoposts.filter((resopost) => resopost.approved).length,
        rejected: resoposts.filter((resopost) => resopost.rejected).length,
      };
      setResourceCounts(counts);
    } catch (error) {
      console.error("Error fetching resource posts:", error);
    }
  };

  fetchProjectPosts();
  fetchResoPosts();
}, [setProjectCounts, setResourceCounts]);

  return null; // This component does not render anything
};

export default PostCounts;