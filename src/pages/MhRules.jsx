import React, { useContext } from "react";
import { DesktopNavbar } from "../components/Home/Home";
import { MobileNavbar } from "../components/Home/Home";
import { AuthContext } from "../context/AuthContext";
import "../pages/MhRules.css";
import rules from "../json/rules.json";

const MhRules = () => {
  const { user, setUser } = useContext(AuthContext);
  return (
    <>
      <div className="home">
        <div className="row">
          <DesktopNavbar />
          <div className="col-lg-9 col-md-8">
            <MobileNavbar />
            <div className="container pt-4 pb-4 right_section">
              <div className="rules">
                <h3 className="text-center">
                  Government Engineering College Palakkad, Sreekrishnapuram
                  Instructions for inmates of MH/LH
                </h3>
                <h4 className="mt-5 text-decoration-underline">
                  Allotment of rooms:
                </h4>
                <ol>
                  {rules.rooms.map((rule,index) => (
                    <li key={index} className="mt-3">{rule.rule}</li>
                  ))}
                </ol>
                <h4 className="mt-5 text-decoration-underline">Catering:</h4>
                <ol>
                  {rules.catering.map((rule,index) => (
                    <li key={index} className="mt-3">{rule.rule}</li>
                  ))}
                </ol>
                <h4 className="mt-5 text-decoration-underline">
                  General discipline:
                </h4>
                <ol>
                  {rules.general.map((rule,index) => (
                    <li key={index} className="mt-3">{rule.rule}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MhRules;
