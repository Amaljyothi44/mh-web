// Messfee.js
import React, { useState, useEffect } from 'react';
import './Messfee.css'
import { DesktopNavbar, MobileNavbar } from "../Home/Home";
import axios from 'axios';
import Notpaid from '../userFee/Nopaid';
import Paidlist from '../userFee/Paidlist';
import ReportPage from '../userFee/Reporttable';
const Messfee = () => {
  const [names, setNames] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNotPaid, setShowNotPaid] = useState(false);
  const [showPaid, setShowPaid] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    axios.get('https://mh-dj-backend.onrender.com/api/names/')
      .then(response => {
        setNames(response.data.names);
      })
      .catch(error => {
        console.error('Error fetching names:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectAll) {
      setSelectedIds(names.map(name => name.id));
    } else {
      setSelectedIds([]);
    }
  }, [selectAll, names]);


  const handleCheckboxChange = (id) => {
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter(selectedId => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const handleSelectAllChange = () => {

    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedIds(names.map(name => name.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (!selectedMonth) {
      alert('Please select a month before submitting.');
      return;
    }
    if (selectedIds.length === 0) {
      alert('Please select at least one name before submitting.');
      return;
    }
    const Postdata = selectedIds.map(id => ({
      month: selectedMonth,
      name: names.find(name => name.id === id).name,
      id: id,
    }));
    axios.post('https://mh-dj-backend.onrender.com/api/fee-add/', Postdata, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Ids submitted successfully:', response.data);
        alert('Demand for the Mess Bill submitting.');
      })
      .catch(error => {
        console.error('Error submitting Ids:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sortedNames = names.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div className="home">
        <div className="row">
          <DesktopNavbar />
          <div className="col-lg-9 col-md-8">
            <MobileNavbar />
            <div className="container pt-4 pb-4 right_section">
              {loading ? (
                <div className='loading-spinner'></div>
              ) : (
                <>
                <button className='sho-btn'style={{backgroundColor:'#008cff'}} onClick={() => setShowReport(!showReport)}>
                    {showReport ? 'Close List' : 'Monthly Report'}
                  </button>
                  {showReport && <ReportPage />}
                  <button className='sho-btn' onClick={() => setShowNotPaid(!showNotPaid)}>
                    {showNotPaid ? 'Close List' : 'View Mess Bill Not paid List'}
                  </button>
                  {showNotPaid && <Notpaid />}
                  <button className='sho-btn' style={{backgroundColor:'#f76fea'}} onClick={() => setShowPaid(!showPaid)}>
                    {showPaid ? 'Close List' : 'Paid List'}
                  </button>
                  {showPaid && <Paidlist/>}
                  <h2>List of Names</h2>
                  <div>
                    <label htmlFor="month">Select Month: </label>
                    <select className='month' id="month" value={selectedMonth} onChange={handleMonthChange} required>
                      <option value="">Select</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                  <div className='se-all'>
                    <label htmlFor="selectAll">Select All: </label>
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </div>
                  <table className="names-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedNames.map(name => (
                        <tr key={name.id}>
                          <td>{name.name}</td>
                          <td>
                            <input
                              type="checkbox"
                              value={name.id}
                              checked={selectedIds.includes(name.id)}
                              onChange={() => handleCheckboxChange(name.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="ad-btn" onClick={handleSubmit}>Submit</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messfee;
