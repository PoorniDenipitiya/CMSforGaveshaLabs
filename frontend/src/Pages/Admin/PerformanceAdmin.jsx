
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavi from "./AdminNavi";
import "./PerformanceAdmin.css";
import { URL } from "../../url";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "33.3%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    margin: 5,
    fontSize: 12,
  },
});


// Create a PDF document component
const EnrollmentReport = ({ enrollments }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Enrollments Report</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Email</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Date</Text>
            </View>
          </View>
          
          {/*data fetch to pdf*/}
          {enrollments.map((post) => (
            <View key={post._id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{post.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{post.email}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </View>

            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const PerformanceAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    action: "",
    topic: "",
    range: "",
    month: "",
  });
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (filters.action && filters.topic && filters.range) {
      fetchEnrollments();
    }
  }, [filters]);

  const fetchEnrollments = async () => {
    try {
      let url = `${URL}/api/projectposts`;
    /*  if (filters.topic === "resources") {
        url = `${URL}/api/resoposts`;
      } */

      const response = await axios.get(url, { params: filters });
      const filteredEnrollments = response.data.filter((post) => {
        const createdAtMonth = new Date(post.createdAt).getMonth() + 1;
        const filterMonth = parseInt(filters.month, 10);
        if (filters.range === "monthly" && createdAtMonth !== filterMonth) {
          return false;
        }
        if (filters.action === "approved") return post.approved;
        if (filters.action === "rejected") return post.rejected;
      {/*  if (filters.action === "created") return post.created;
        if (filters.action === "added") return post.added;*/}
        return true;
      });
      if (filters.topic === "projects") {
        setProjects(filteredEnrollments);
      }/* else if (filters.topic === "resources") {
        setResourcePosts(filteredEnrollments);
      }*/
      setEnrollments(filteredEnrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
      return res.data; // Assuming res.data contains { name, email, ... }
    } catch (err) {
      console.error(`Error fetching user profile for user ${userId}:`, err);
      return null;
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div>
      <AdminNavi />
      <div className="admin_content">
        <div
          style={{
            padding: "20px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        >
          <h2>Filter Enrollments</h2>
          <br></br>
          <div>
            <label className="admin_label_performance">
              Date Range:
              <select
                name="range"
                value={filters.range}
                onChange={handleChange}
                style={{
                  marginLeft: "10px",
                  borderRadius: "5px",
                  backgroundColor: "pink",
                }}
              >
                <option value="">Select Range</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
          {filters.range === "monthly" && (
            <div>
              <label className="admin_label_performance">
                Month:
                <select
                  name="month"
                  value={filters.month}
                  onChange={handleChange}
                  style={{
                    marginLeft: "10px",
                    borderRadius: "5px",
                    backgroundColor: "pink",
                  }}
                >
                  <option value="">Select Month</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </label>
            </div>
          )}
          <div>
            <label className="admin_label_performance">
              Action:
              <select
                name="action"
                value={filters.action}
                onChange={handleChange}
                style={{
                  marginLeft: "10px",
                  borderRadius: "5px",
                  backgroundColor: "pink",
                }}
              >
                <option value="">Select Action</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>
          <div>
            <label className="admin_label_performance">
              Topic:
              <select
                name="topic"
                value={filters.topic}
                onChange={handleChange}
                style={{
                  marginLeft: "10px",
                  borderRadius: "5px",
                  backgroundColor: "pink",
                }}
              >
                <option value="">Select Topic</option>
                <option value="projects">Projects</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ccc" }}>
          <h2>Download Report</h2>
          <br></br>
          <div>{enrollments.length} Enrollments Found</div>
          <button className="performance_downloadbutton">
          <PDFDownloadLink
            document={<EnrollmentReport enrollments={enrollments} />}
            fileName="enrollments_report.pdf"
            style={{textDecoration:" none", color:"white"}}
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Download Report"
            }
          </PDFDownloadLink>
          </button>
          <table
            border="1"
            style={{ width: "100%", marginTop: "20px", backgroundColor: "rgb(231, 189, 237)" }}
            className="Performance_table"
          >
            <thead>
              <tr className="Performance_tr">
                <th style={{ paddingLeft: "10px" }} className="Performance_th">Name</th>
                <th style={{ paddingLeft: "10px" }} className="Performance_th">Email</th>
                <th style={{ paddingLeft: "10px" }} className="Performance_th">Date</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment._id} className="Performance_tr">
                  <td style={{ paddingLeft: "10px" }} className="Performance_td">{enrollment.name}</td>
                  <td style={{ paddingLeft: "10px" }} className="Performance_td">{enrollment.email}</td>
                  <td style={{ paddingLeft: "10px" }} className="Performance_td">
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAdmin;
