import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('https://mh-dj-backend.onrender.com/api/report/');
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  

  return (
    <div style={{ textAlign: 'center',}}>
      <h2>Monthly Report</h2>
      {loading ? (
        <div className='loading-spinner'></div>
      ) : (
        <table style={{ margin: 'auto', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Paid</th>
              <th>Not Paid</th>
              <th>Offline</th>
              <th>Online </th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((report, index) => (
              <tr key={index}>
                <td>{report.month}</td>
                <td>{report.paid_count}</td>
                <td>{report.not_paid_count}</td>
                <td>{report.paid_online_count}</td>
                <td>{report.paid_offline_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportPage;
