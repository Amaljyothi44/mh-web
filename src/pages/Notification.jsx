import React, { useContext, useEffect, useState } from "react";
import { DesktopNavbar } from "../components/Home/Home";
import { MobileNavbar } from "../components/Home/Home";
import { AuthContext } from "../context/AuthContext";
import "../pages/MhRules.css";
import { db } from "../firebse/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import NoData from "../components/NoData/NoData";

const Notification = () => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const files = query(
      collection(db, "Notifications"),
      orderBy("created", "desc")
    );
    onSnapshot(files, (QuerySnapshot) => {
      if (QuerySnapshot.empty) {
        setFiles([]);
      }
      setFiles(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="home">
      <div className="row">
        <DesktopNavbar />
        <div className="col-lg-9 col-md-8">
          <MobileNavbar />
          <div className="container pt-4 pb-4 right_section">
            <h2>Notifications</h2>

            <div className="notifications mt-2">
              {files.length == 0 ? (
                <NoData title="No Notifications"/>
              ) : (
                <>
                  {files?.map((doc) => (
                    <div key={doc.id} className="noti mt-2">
                      <a className="text-black" href={`${doc.data.pdfUrl}`}>
                        {doc.data.heading}
                      </a>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
