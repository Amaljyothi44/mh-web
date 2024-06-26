import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Nopaid.css'
import ReportPage from './Reporttable';
const Paidlist = () => {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeeData = async () => {
            try {
                const response = await axios.get('https://mh-dj-backend.onrender.com/api/fee/');

                const PaidNames = response.data.filter(data => data.Fee);
                setNames(PaidNames);
            } catch (error) {
                console.error('Error fetching fee data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeData();
    }, []);

    const sortedName = names.slice().sort((a, b) => a.name.localeCompare(b.name));
    const monthsOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const sortedNames = sortedName.slice().sort((a, b) => {
      const monthA = monthsOrder.indexOf(a.month);
      const monthB = monthsOrder.indexOf(b.month);
    
      return monthA - monthB;
    });

    const scrollToTop = () => {
        const firstRow = document.getElementById('row');
        if (firstRow) {
          firstRow.scrollIntoView({ behavior: 'smooth' });
        }
      };

    return (
        <div style={{ textAlign: 'center', paddingTop: '30px' }}>

            {loading ? (
                <div className='loading-spinner'></div>
            ) : (
                <>
                    <h2 id= 'row'>Names: Mess Bill Paid</h2>
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
                                <tr key={name.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {name.name}
                                        {name.mode === 'Offline' ? <span style={{ color: 'red', fontSize: '10px' }}> 🔴</span> : <span style={{ color: 'green', fontSize: '10px', }}> 🟢</span>}
                                    </td>

                                    <td>{name.month}<br /><span style={{ fontSize: '10px' }}>{name.date}</span></td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='sho-2btn' onClick={() => scrollToTop()} style={{ marginTop: '10px' }}>
                        &#8593; Move to Top
                    </button>
                </>)}
        </div>
    );
};

export default Paidlist;
