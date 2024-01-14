import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Nopaid.css';

const Notpaid = () => {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const response = await axios.get('https://mh-dj-backend.onrender.com/api/fee/');
        const notPaidNames = response.data.filter(data => !data.Fee);
        setNames(notPaidNames);
      } catch (error) {
        console.error('Error fetching fee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, []);

  const sortedNames = names.slice().sort((a, b) => a.name.localeCompare(b.name));

  const scrollToTop = () => {
    const firstRow = document.getElementById('row-1');
    if (firstRow) {
      firstRow.scrollIntoView({ behavior: 'smooth' });
    }
  };
   
  return (
    <div style={{ textAlign: 'center', paddingTop: '30px' }}>
      <h2 id = 'row-1'>Names: Mess Bill Not Paid</h2>
      {loading ? (
        <div className='loading-spinner'></div>
      ) : (
        <>
          <table style={{ margin: 'auto', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Name</th>
                <th>Month</th>
              </tr>
            </thead>
            <tbody>
              {sortedNames.map((name, index) => (
                 <tr key={name.id} >
                  <td>{index + 1}</td>
                  <td>{name.name}</td>
                  <td>{name.month}</td>
                </tr>
              ))}
            </tbody>
          </table>
           <button className='sho-2btn' onClick={() => scrollToTop()} style={{ marginTop: '10px' }}>
            &#8593; Move to Top
          </button>
        </>
      )}
    </div>
  );
};

export default Notpaid;
