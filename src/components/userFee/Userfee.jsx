import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DesktopNavbar, MobileNavbar } from "../Home/Home";
import axios from 'axios';
import Notpaid from './Nopaid';
import './Userfee.css'

const Userfee = () => {
  const { user } = useContext(AuthContext);
  const [feeData, setFeeData] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [paymentImage, setPaymentImage] = useState(null);
  const [mode, setMode] = useState([]);
  const [sortedFeeData, setSortedFeeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sortedData = [...feeData].sort((a, b) => (a.Fee ? 1 : -1));
    setSortedFeeData(sortedData);

  }, [feeData]);


  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const response = await axios.get('https://mh-dj-backend.onrender.com/api/fee/');
        const userData = response.data.filter(data => data.user_id === user.uid);
        const initializedFeeData = userData.map(data => ({ ...data, declarationChecked: false }));
        setFeeData(initializedFeeData);
        const paymentStatusArray = initializedFeeData.map(data => (data.Fee ? 'Paid' : 'Not Paid'));
        setPaymentStatus(paymentStatusArray)
      } catch (error) {
        console.error('Error fetching fee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();

  }, [user.uid]);

  const handleDeclarationChange = (month) => {
    setFeeData(prevFeeData =>
      prevFeeData.map(item =>
        item.month === month
          ? { ...item, declarationChecked: !item.declarationChecked }
          : item
      )
    );
  };

  const handleModeChange = (event, month) => {
    const selectedMode = event.target.value;
    setMode(prevMode => [...prevMode, { month, mode: selectedMode }]);
  }

  const handlePaymentSubmit = async (e, month) => {
    setLoading(true)
    e.preventDefault();
    if (!feeData.find(data => data.month === month)?.declarationChecked) {
      alert('Please check the declaration before submitting.');
      return;
    }
    const selectedMode = mode.find(item => item.month === month);
    if (!selectedMode || selectedMode.mode == null) {
      alert('Please select the Mode of Payment.');
      return;
    }

    try {
      const paymentData = {
        user_id: user.uid,
        month: month,
        mode: selectedMode.mode,
        paymentImage: null,
      };

      axios.post('https://mh-dj-backend.onrender.com/api/fee-update/', paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await axios.get('https://mh-dj-backend.onrender.com/api/fee/');
      const userData = response.data.filter(data => data.user_id === user.uid);
      const updatedFeeData = userData.map(data => ({ ...data, declarationChecked: false }));
      setFeeData(updatedFeeData);

      setPaymentStatus('Paid')
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (isPaid) => {
    return isPaid ? 'green' : 'red';
  };

  return (
    <>
      <div className="home">
        <div className="row">
          <DesktopNavbar />
          <div className="col-lg-9 col-md-8">
            <MobileNavbar />
            <div className="container pt-4 pb-4 right_section">
              <h2>Mess Fee</h2>
              {loading ? (
                <div className='loading-spinner'></div>
              ) : (
                <>
                  {feeData ? (
                    sortedFeeData.map((data) => (
                      <div key={data.month} className="card">
                        <p>Month: {data.month}</p>
                        <p style={{ color: getStatusColor(data.Fee) }}>Fee Status: {data.Fee ? 'Paid' : 'Not Paid'}</p>
                        {data.Fee ? (
                          <p></p>
                        ) : (
                          <div>
                            <p>
                              Declaration: I declare that I have paid the amount for the month.
                              <label>
                                <input
                                  type="checkbox"
                                  checked={data.declarationChecked}
                                  onChange={() => handleDeclarationChange(data.month)}
                                  required
                                />
                                I agree
                              </label>
                            </p>
                            <div>
                              <label htmlFor={`mode-${data.month}`}>Select Mode of Payment: </label>
                              <select
                                id={`mode-${data.month}`}
                                value={mode.find(item => item.month === data.month)?.mode || ''}
                                onChange={(e) => handleModeChange(e, data.month)}
                                required
                              >
                                <option value="">Select</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                              </select>
                            </div>
                            <form onSubmit={(e) => handlePaymentSubmit(e, data.month)}>
                              <label>
                                Upload Payment Image:
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setPaymentImage(e.target.files[0])}
                                  required
                                />
                              </label>
                              <button type="submit">Submit Payment</button>
                            </form>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No fee data available for the user.</p>
                  )}
                  <Notpaid />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userfee;
