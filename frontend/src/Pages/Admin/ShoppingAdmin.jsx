import React from "react";
import { useEffect } from "react";
import AdminNavi from "./AdminNavi";
import "./ShoppingAdmin.css";
import AdStatsChart from "./AdStatsChart";
//scroll
import AOS from "aos";
import "aos/dist/aos.css";

const ShoppingAdmin = () => {
  useEffect(() => {
    AOS.refresh(); // Refresh AOS on component mount/update
  }, []);

  return (
    <div data-aos="fade-up">
      <AdminNavi></AdminNavi>
      <div className="admin_content">
        <h1>Shopping Page</h1> <br></br>
        <AdStatsChart />
      </div>
    </div>
  );
};

export default ShoppingAdmin;