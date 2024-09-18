import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";
import BlogsAdmin from "./BlogsAdmin";
// import other components as necessary
import AdminNavi from "./AdminNavi";
import PostCounts from "./PostCounts";
import AdminGraph from "./AdminGraph"; // Adjust the import path as necessary
import AdStatsChart from "./AdStatsChart";
import useIncrementingCount from "./useIncrementingCount"; // Import the custom hook

// scroll
import AOS from "aos";
import "aos/dist/aos.css";
 
export const Admin = () => {
  const [projectCounts, setProjectCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [resourceCounts, setResourceCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // count increment effect
  const animatedPendingProjectCount = useIncrementingCount(
    projectCounts.pending
  );
  const animatedApprovedProjectCount = useIncrementingCount(
    projectCounts.approved
  );
  const animatedRejectedProjectCount = useIncrementingCount(
    projectCounts.rejected
  );

  const animatedPendingResourceCount = useIncrementingCount(
    resourceCounts.pending
  );
  const animatedApprovedResourceCount = useIncrementingCount(
    resourceCounts.approved
  );
  const animatedRejectedResourceCount = useIncrementingCount(
    resourceCounts.rejected
  );

  const totalPendingCount = projectCounts.pending + resourceCounts.pending;

  useEffect(() => {
    AOS.refresh(); // Refresh AOS on component mount/update
  }, []);

  return (
    <div data-aos="fade-up">
      <AdminNavi
        totalPendingCount={totalPendingCount}
        projectCounts={projectCounts}
        resourceCounts={resourceCounts}
      />
      <PostCounts
        setProjectCounts={setProjectCounts}
        setResourceCounts={setResourceCounts}
      />
      <div className="admin_content">
        <div className="admin_griditem1">Projects</div>
        <div className="admin_griditem2">
          <Link to={"/projectsadmin/pending"}>
            <div className="admin_box">
              Pending approval projects <br />
              <p className="countstyle">{animatedPendingProjectCount} </p>
            </div>
          </Link>
          <Link to={"/projectsadmin/approved"}>
            <div className="admin_box">
              Approved project <br />
              <p className="countstyle">{animatedApprovedProjectCount}</p>
            </div>
          </Link>
          <Link to={"/projectsadmin/rejected"}>
            <div className="admin_box">
              Rejected project <br />
              <p className="countstyle">{animatedRejectedProjectCount}</p>
            </div>
          </Link>
        </div>
        <hr></hr>
        <div className="admin_griditem3">Resources</div>
        <div className="admin_griditem4">
          <Link to={"/resourcesadmin/pending"}>
          <div className="admin_box">
              Pending approval Resources <br></br>
              <p className="countstyle">{animatedPendingResourceCount} </p>
            </div>
          </Link>
          <Link to={"/resourcesadmin/approved"}>
          <div className="admin_box">
              Approved resources<br></br>
              <p className="countstyle">{animatedApprovedResourceCount}</p>
            </div>
          </Link>
          <Link to={"/resourcesadmin/rejected"}>
            {" "}
            <div className="admin_box">
              Rejected resources<br></br>
              <p className="countstyle">{animatedRejectedResourceCount}</p>
            </div>
          </Link>
        </div>
        <hr></hr>
        <div className="admin_griditem6_new">
          <Link to='/shoppingsadmin' className="admin_box graph">
            Shopping graph <AdStatsChart />
          </Link>
          <Link to="/blogsadmin" className="admin_box blogs">
            Blogs
          </Link>
          <Link to="/forum" className="admin_box forum" target="_blank"> 
            Community meet up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;