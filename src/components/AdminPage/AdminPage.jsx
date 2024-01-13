import React, { useEffect, useState, useContext } from "react";
import { Col, Container, Row, Button, Card } from "react-bootstrap";
import "../AdminPage/AdminPage.css";
import { DesktopNavbar, Layout, MobileNavbar, PageRoute } from "../Home/Home";
import { animated, useSpring } from "@react-spring/web";
import { db } from "../../firebse/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import AdminDetails from "../AdminDetails/AdminDetails";
import UserDetails from "../UserDetails/UserDetails";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { LoadingContext } from "../../context/LoadingContext";
import NoData from "../NoData/NoData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const AdminPage = () => {
  const { loading, setLoading } = useContext(LoadingContext);
  let day = new Date();
  let dateString = `${day.getFullYear()}-${
    day.getMonth() + 1
  }-${day.getDate()}`;
  const { user, setUser } = useContext(AuthContext);
  const [reqDate, setReqDate] = useState(dateString);
  const [details, setDetails] = useState([]);
  const [error, setError] = useState("");
  const [specialFoodError, setSpecialFoodError] = useState("");
  const [noData, setNoData] = useState(false);
  

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const q = query(collection(db, reqDate), orderBy("createdAt", "desc"));
      onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          console.log("data empty", snapshot.empty);
          setNoData(true);
        } else {
          setNoData(false);
          setDetails(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        }
      });
    } catch (e) {
      setError("Please enter date");
    }
  };

  const addSpecialFood = (e) => {
    e.preventDefault();
    if (!specialFoodDate) {
      setSpecialFoodError("Date must not be empty");
      return;
    }
    setSpecialFoodError("");
    setLoading(true);
    setDoc(doc(db, "special_food", "date"), {
      date: specialFoodDate,
      createdAt: Timestamp.now(),
    })
      .then(() => {
        setSpecialFoodError("");
        setLoading(false);
      })
      .catch((err) => console.warn(err.message));
  };

  let morningCount = 0;
  let noonCount = 0;
  let nightCount = 0;

  details &&
    details.map((data) => {
      if (!data.foodData.morning) {
        morningCount = morningCount + 1;
      }
      if (!data.foodData.noon) {
        noonCount = noonCount + 1;
      }
      if (!data.foodData.night) {
        nightCount = nightCount + 1;
      }
    });

  const TableAnimation = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });
  const [specialFoodDate, setSpecialFoodDate] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);

  // define function
  const generatePdf = (data, date) => {
    setPdfLoading(true);
    // data && console.log(data.map(doc => doc.foodData))

    const doc = new jsPDF();

    // define the columns we want and their titles
    const tableColumn = ["No", "Name", "Morning", "Noon", "Night"];
    // define an empty array of rows
    const tableRows = [];

    let count = 0;

    data.forEach((doc) => {
      const foodData = [
        (count = count + 1),
        doc.name.toUpperCase(),
        doc.foodData.morning ? "Yes" : "No",
        doc.foodData.noon ? "Yes" : "No",
        doc.foodData.night ? "Yes" : "No",
      ];
      tableRows.push(foodData);
    });

    //console.log(tableRows)

    doc.text(reqDate, 14, 10);
    doc.text("Food Details", 14, 15);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });

    doc.save(`${date}_report.pdf`);
    setPdfLoading(false);
  };

  return (
    <>
      <div className="home">
        <div className="row">
          <DesktopNavbar />
          <div className="col-lg-9 col-md-8">
            <MobileNavbar />
            <div className="container pt-4 pb-4 right_section">
              <div className="routes">
                {user ? <UserDetails /> : null}
                <PageRoute title="Men's Hostel/Admin" />
                <Link to={"/new-users"} className="new_users_link">
                  <p className="new_users_link mt-3">Create new User</p>
                  <p className="new_users_link mt-2">Add notification</p>
                </Link>
              </div>

              <div className="row">
                <div className="col-lg-4 col-md-4 col-12 mt-2">
                  <div className="admin_data">
                    <div className="date_input p-4">
                      <h3 className="admin_data_heading">Food Details</h3>
                      <input
                        type="date"
                        required
                        value={reqDate}
                        onChange={(e) => setReqDate(e.target.value)}
                        className="mt-3"
                      />
                      <p className={error ? "error mt-4" : null}>
                        {error ? error : null}
                      </p>
                      <button
                        onClick={handleClick}
                        className="btn btn-primary mt-2"
                      >
                        Get Details
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-12 mt-2">
                  <div className="admin_data">
                    <div className="date_input p-4">
                      <h3 className="admin_data_heading">
                        Add Special Food on
                      </h3>
                      <input
                        type="date"
                        required
                        value={specialFoodDate}
                        onChange={(e) => setSpecialFoodDate(e.target.value)}
                        className="mt-3"
                      />
                      <p className={specialFoodError ? "error_msg mt-4" : null}>
                        {specialFoodError ? specialFoodError : null}
                      </p>
                      <button
                        onClick={addSpecialFood}
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <ClipLoader size={20} color="#fff" />
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-12 mt-2">
                  {details.length === 0 ? null : (
                    <>
                      <animated.div
                        style={TableAnimation}
                        className="admin_data"
                      >
                        <div className="mess_cut_data p-4">
                          <h3 className="admin_data_heading">
                            Daily Report (Total cuts)
                          </h3>
                          <p className="mt-3">Morning : {morningCount}</p>
                          <p>Noon : {noonCount}</p>
                          <p>Night : {nightCount}</p>
                        </div>
                      </animated.div>
                    </>
                  )}
                </div>
                <div className="col-lg-12 col-md-12 col-12">
                  {noData ? (
                    <Card className="mt-3">
                      <NoData title={"Nobody Responded"} />
                    </Card>
                  ) : (
                    <>
                      {details.length > 0 ? (
                        <div className="admin_data_table mt-5">
                          <h2>Food Details</h2>

                          <p>{reqDate}</p>
                          <button
                            onClick={() => generatePdf(details, reqDate)}
                            className="btn btn-primary m-3"
                          >


                            {pdfLoading ? "Generating Pdf" : "Generate Pdf"}
                          </button>
                          <AdminDetails details={details} />
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
