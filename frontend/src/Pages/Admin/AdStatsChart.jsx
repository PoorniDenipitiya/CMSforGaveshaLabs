import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const AdStatsGraph = () => {
  const [adStats, setAdStats] = useState([]);

  useEffect(() => {
    const fetchAdStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ad-stats');
        setAdStats(response.data);
      } catch (error) {
        console.error("Error fetching ad stats:", error);
      }
    };

    fetchAdStats();

    const intervalId = setInterval(fetchAdStats, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={adStats} margin={{ top: 5, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" /> {/*dashed line*/}
        <XAxis dataKey="date">
          <Label value="Date" offset={-5} position="insideBottom" dy={10} /> 
        </XAxis>
        <YAxis>
          <Label value="Number of Posts" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <Tooltip /> {/*appears when hovering over data points, displaying information about the data.*/}
        <Legend wrapperStyle={{ marginBottom: -30 }} /> {/*identify different lines and their corresponding data.*/}
        <Line type="linear" dataKey="remainingCount" stroke="#E14308" name="Newly Added Posts"  /> 
       {/* <Line type="linear" dataKey="remainingCount" stroke="#ff7300" name="Newly Added Posts" /> */}
        {/*<Line type="monotone" dataKey="deletedCount" stroke="#82ca9d" name="Deleted Posts" />*/}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdStatsGraph;