import React from "react";
import "../UserDetails/UserDetails.css";
import { auth } from "../../firebse/config";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserDetails = () => {
  const { user, setUser } = useContext(AuthContext);
  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem("user");
    });
  };
  return (
    <div className="user_details">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-7 user_data">
          <p>{user.name}</p>
        </div>
        <div className="col-lg-6 col-md-6 col-5 user_data_logout_button">
          <button onClick={logout}>
            Logout <i className="bi bi-arrow-up-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
