// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';
// import 'chart.js/auto';

// const AdminGraph = () => {
//   const [analyticsData, setAnalyticsData] = useState([]);

//   useEffect(() => {
//     const fetchAnalyticsData = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/analytics');
//         console.log('Fetched Analytics Data:', response.data);
//         if (Array.isArray(response.data)) {
//           setAnalyticsData(response.data);
//         } else {
//           console.error('Unexpected response format:', response.data);
//           setAnalyticsData([]);
//         }
//       } catch (error) {
//         console.error('Error fetching analytics data:', error);
//         setAnalyticsData([]);
//       }
//     };
//     fetchAnalyticsData();
//   }, []);


//   if (!Array.isArray(analyticsData) || analyticsData.length === 0) {
//     return <div>No data available</div>;
//   }

//   // Prepare data for the chart
//   const chartData = {
//     labels: analyticsData.map(data => new Date(data.date).toLocaleDateString()), // Use dates as labels
//     datasets: [
//       {
//         label: 'Remaining Ads',
//         data: analyticsData.map(data => data.remainingAds),
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         fill: false,
//       },
//       {
//         label: 'Deleted Ads',
//         data: analyticsData.map(data => data.deletedAds),
//         borderColor: 'rgba(255, 99, 132, 1)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         fill: false,
//       },
//     ],
//   };

//   return (
//     <div>
//     <Line data={chartData} />
//   </div>
//   );
// };

// export default AdminGraph;