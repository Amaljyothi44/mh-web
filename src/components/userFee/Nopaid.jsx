import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Nopaid.css'
const Notpaid = () => {
  const [names, setNames] = useState([]);

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const response = await axios.get('https://mh-dj-backend.onrender.com/api/fee/');
        const notPaidNames = response.data.filter(data => !data.Fee);
        setNames(notPaidNames);
      } catch (error) {
        console.error('Error fetching fee data:', error);
      }
    };

    fetchFeeData();
  }, []);
  const sortedNames = names.slice().sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div style={{ textAlign: 'center',paddingTop:'30px' }}>
      <h2>Names: Mess Bill Not Paid</h2>
      <table style={{ margin: 'auto', marginTop:'20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Month</th>
          </tr>
        </thead>
        <tbody>
          {sortedNames.map(name => (
            <tr key={name.id}>
             
              <td>{name.name}</td>
              <td>{name.month}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notpaid;
